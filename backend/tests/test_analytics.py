import json
import os
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import app
from app.models.analytics import AnalyticsEventRequest, PRODUCT_EVENTS
from app.services.analytics import store_analytics_event


ALL_EVENTS = [
    "premium_product_clicked",
    "checkout_opened",
    "payment_intent_clicked",
    "coming_soon_viewed",
    "launch_interest_clicked",
    "reading_started",
    "free_reading_completed",
]


def valid_payload(event="reading_started", **overrides):
    payload = {
        "id": "evt_test_123",
        "event": event,
        "language": "ko",
        "sessionId": "session_test_123",
        "timestamp": "2026-08-21T05:00:00Z",
        "source": "free_reading",
    }
    if event in PRODUCT_EVENTS:
        payload.update(
            {
                "productId": "deep_reading",
                "priceKRW": 4900,
                "priceUSD": 3.99,
                "source": "pricing",
            }
        )
    payload.update(overrides)
    return payload


class FakeResponse:
    status = 201

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False


class AnalyticsValidationTests(unittest.TestCase):
    def test_all_seven_events_are_allowed(self):
        for event in ALL_EVENTS:
            with self.subTest(event=event):
                self.assertEqual(AnalyticsEventRequest.model_validate(valid_payload(event)).event, event)

    def test_product_and_languages_are_allowed(self):
        for product_id in ["deep_reading", "lucky_numbers", "digital_talisman", "arcana_bundle"]:
            for language in ["ko", "en"]:
                with self.subTest(product_id=product_id, language=language):
                    event = AnalyticsEventRequest.model_validate(
                        valid_payload("checkout_opened", productId=product_id, language=language)
                    )
                    self.assertEqual(event.productId, product_id)
                    self.assertEqual(event.language, language)

    def assert_invalid(self, **overrides):
        with self.assertRaises(ValidationError):
            AnalyticsEventRequest.model_validate(valid_payload(**overrides))

    def test_unknown_event_is_rejected(self):
        self.assert_invalid(event="story_submitted")

    def test_invalid_product_is_rejected(self):
        self.assert_invalid(event="checkout_opened", productId="unknown_product")

    def test_invalid_language_is_rejected(self):
        self.assert_invalid(language="fr")

    def test_long_string_is_rejected(self):
        self.assert_invalid(sessionId="s" * 129)

    def test_extra_field_is_rejected(self):
        self.assert_invalid(storyText="must never be collected")

    def test_product_fields_are_rejected_for_reading_events(self):
        self.assert_invalid(productId="deep_reading")


class AnalyticsEndpointTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_disabled_provider_accepts_without_storage(self):
        with patch.dict(os.environ, {"ANALYTICS_PROVIDER": "disabled"}, clear=False):
            response = self.client.post("/api/analytics/events", json=valid_payload())
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json(), {"accepted": True, "stored": False})

    def test_health_and_reading_routes_are_available_without_supabase(self):
        with patch.dict(os.environ, {"ANALYTICS_PROVIDER": "disabled", "READING_PROVIDER": "mock"}, clear=False):
            health = self.client.get("/api/health")
            reading = self.client.post(
                "/api/readings/free",
                json={
                    "entryType": "CONCERN",
                    "storyText": "테스트를 위한 최소 입력입니다.",
                    "ritualType": "reflection",
                    "selectedCardId": "the_star",
                    "language": "ko",
                },
            )
        self.assertEqual(health.status_code, 200)
        self.assertEqual(reading.status_code, 200)
        paths = set(app.openapi()["paths"])
        self.assertIn("/api/readings/free", paths)
        self.assertIn("/api/analytics/events", paths)

    def test_endpoint_rejects_extra_fields(self):
        response = self.client.post(
            "/api/analytics/events",
            json=valid_payload(storyText="private story"),
        )
        self.assertEqual(response.status_code, 422)


class SupabaseStorageTests(unittest.TestCase):
    def test_supabase_rest_payload_contains_only_allowed_columns(self):
        event = AnalyticsEventRequest.model_validate(valid_payload("checkout_opened"))
        captured = {}

        def fake_urlopen(request, timeout):
            captured["body"] = json.loads(request.data.decode("utf-8"))
            captured["timeout"] = timeout
            captured["authorization"] = request.headers["Authorization"]
            return FakeResponse()

        env = {
            "ANALYTICS_PROVIDER": "supabase",
            "SUPABASE_URL": "https://example.supabase.co",
            "SUPABASE_SERVICE_ROLE_KEY": "test-service-role-key",
        }
        with patch.dict(os.environ, env, clear=False), patch(
            "app.services.analytics.urlopen", side_effect=fake_urlopen
        ):
            self.assertTrue(store_analytics_event(event))

        self.assertEqual(
            set(captured["body"]),
            {
                "id",
                "event",
                "product_id",
                "language",
                "session_id",
                "source",
                "price_krw",
                "price_usd",
                "client_timestamp",
            },
        )
        self.assertNotIn("storyText", captured["body"])
        self.assertLessEqual(captured["timeout"], 10.0)
        self.assertEqual(captured["authorization"], "Bearer test-service-role-key")

    def test_missing_supabase_configuration_does_not_raise(self):
        event = AnalyticsEventRequest.model_validate(valid_payload())
        with patch.dict(
            os.environ,
            {
                "ANALYTICS_PROVIDER": "supabase",
                "SUPABASE_URL": "",
                "SUPABASE_SERVICE_ROLE_KEY": "",
            },
            clear=False,
        ):
            self.assertFalse(store_analytics_event(event))


if __name__ == "__main__":
    unittest.main()

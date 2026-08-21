import json
import logging
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from ..models.analytics import AnalyticsEventRequest


logger = logging.getLogger(__name__)


def _supabase_timeout_seconds() -> float:
    raw_value = os.environ.get("ANALYTICS_SUPABASE_TIMEOUT_SECONDS", "2.5")
    try:
        return min(max(float(raw_value), 0.5), 10.0)
    except ValueError:
        return 2.5


def store_analytics_event(event: AnalyticsEventRequest) -> bool:
    provider = os.environ.get("ANALYTICS_PROVIDER", "disabled").lower()
    if provider in {"disabled", "local"}:
        return False

    if provider != "supabase":
        logger.warning("Analytics storage skipped: unsupported provider")
        return False

    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not supabase_url or not service_role_key:
        logger.warning("Analytics storage skipped: Supabase is not configured")
        return False

    request = Request(
        f"{supabase_url}/rest/v1/analytics_events?on_conflict=id",
        data=json.dumps(event.to_storage_payload()).encode("utf-8"),
        method="POST",
        headers={
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=ignore-duplicates,return=minimal",
        },
    )

    try:
        with urlopen(request, timeout=_supabase_timeout_seconds()) as response:
            return 200 <= response.status < 300
    except HTTPError as error:
        if error.code == 409:
            return True
        logger.warning("Analytics storage failed with HTTP status %s", error.code)
    except (URLError, TimeoutError, OSError):
        logger.warning("Analytics storage failed")

    return False

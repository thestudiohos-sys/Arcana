from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


AnalyticsEventName = Literal[
    "premium_product_clicked",
    "checkout_opened",
    "payment_intent_clicked",
    "coming_soon_viewed",
    "launch_interest_clicked",
    "reading_started",
    "free_reading_completed",
]

ProductId = Literal[
    "deep_reading",
    "lucky_numbers",
    "digital_talisman",
    "arcana_bundle",
]

PRODUCT_EVENTS = {
    "premium_product_clicked",
    "checkout_opened",
    "payment_intent_clicked",
    "coming_soon_viewed",
    "launch_interest_clicked",
}


class AnalyticsEventRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., min_length=1, max_length=80, pattern=r"^[A-Za-z0-9_-]+$")
    event: AnalyticsEventName
    productId: Optional[ProductId] = None
    language: Literal["ko", "en"]
    sessionId: str = Field(..., min_length=1, max_length=128, pattern=r"^[A-Za-z0-9_-]+$")
    timestamp: datetime
    source: str = Field(..., min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")
    priceKRW: Optional[int] = Field(default=None, ge=0, le=1_000_000_000)
    priceUSD: Optional[float] = Field(default=None, ge=0, le=1_000_000)

    @model_validator(mode="after")
    def validate_product_fields(self):
        if self.event in PRODUCT_EVENTS:
            if self.productId is None:
                raise ValueError("productId is required for product events")
        elif self.productId is not None or self.priceKRW is not None or self.priceUSD is not None:
            raise ValueError("product fields are not allowed for reading events")
        return self

    def to_storage_payload(self) -> dict:
        return {
            "id": self.id,
            "event": self.event,
            "product_id": self.productId,
            "language": self.language,
            "session_id": self.sessionId,
            "source": self.source,
            "price_krw": self.priceKRW,
            "price_usd": self.priceUSD,
            "client_timestamp": self.timestamp.isoformat(),
        }


class AnalyticsEventResponse(BaseModel):
    accepted: bool = True
    stored: bool

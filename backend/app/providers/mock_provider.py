from .base import BaseReadingProvider
from ..models.reading import FreeReadingRequest, FreeReadingResponse, PremiumReadingRequest, PremiumReadingResponse
from ..services.mock_free_reading import generate_mock_free_reading
from ..services.mock_premium_reading import generate_mock_premium_reading

class MockReadingProvider(BaseReadingProvider):
    def generate_free_reading(self, req: FreeReadingRequest) -> FreeReadingResponse:
        return generate_mock_free_reading(req)

    def generate_premium_reading(self, req: PremiumReadingRequest) -> PremiumReadingResponse:
        return generate_mock_premium_reading(req)

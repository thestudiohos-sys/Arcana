from fastapi import APIRouter, Request
from ..models.reading import FreeReadingRequest, FreeReadingResponse, PremiumReadingRequest, PremiumReadingResponse
from ..providers.factory import get_reading_provider
from ..services.rate_limiter import rate_limiter

router = APIRouter(prefix="/readings", tags=["readings"])

@router.post("/free", response_model=FreeReadingResponse)
def get_free_reading(req: FreeReadingRequest, request: Request):
    rate_limiter.check_rate_limit(request, "free")
    provider = get_reading_provider()
    return provider.generate_free_reading(req)

@router.post("/premium", response_model=PremiumReadingResponse)
def get_premium_reading(req: PremiumReadingRequest, request: Request):
    rate_limiter.check_rate_limit(request, "premium")
    provider = get_reading_provider()
    return provider.generate_premium_reading(req)



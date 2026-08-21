from fastapi import APIRouter, Request, status

from ..models.analytics import AnalyticsEventRequest, AnalyticsEventResponse
from ..services.analytics import store_analytics_event
from ..services.rate_limiter import rate_limiter


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post(
    "/events",
    response_model=AnalyticsEventResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def record_analytics_event(req: AnalyticsEventRequest, request: Request):
    rate_limiter.check_rate_limit(request, "analytics")
    stored = store_analytics_event(req)
    return AnalyticsEventResponse(stored=stored)

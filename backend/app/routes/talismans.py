from fastapi import APIRouter
from ..models.talismans import DigitalTalismanRequest, DigitalTalismanResponse
from ..services.mock_talisman import generate_mock_talisman_options

router = APIRouter(prefix="/talismans", tags=["talismans"])

@router.post("/options", response_model=DigitalTalismanResponse)
def get_talisman_options(req: DigitalTalismanRequest):
    return generate_mock_talisman_options(req)

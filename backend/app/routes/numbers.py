from fastapi import APIRouter
from ..models.numbers import SymbolicNumberRequest, SymbolicNumberResponse
from ..services.mock_symbolic_numbers import generate_mock_symbolic_numbers

router = APIRouter(prefix="/numbers", tags=["numbers"])

@router.post("/symbolic", response_model=SymbolicNumberResponse)
def get_symbolic_numbers(req: SymbolicNumberRequest):
    return generate_mock_symbolic_numbers(req)

from typing import List, Optional
from pydantic import BaseModel, Field
from .enums import EntryType, RitualType, NumberGameType

class SymbolicNumberRequest(BaseModel):
    gameType: NumberGameType = NumberGameType.KR_LOTTO_645
    entryType: EntryType
    storyText: str = Field(..., min_length=3, max_length=500)
    ritualType: RitualType
    freeCardId: Optional[str] = None
    premiumCardIds: Optional[List[str]] = None

class SymbolicNumberResponse(BaseModel):
    gameType: NumberGameType
    mainNumbers: List[int]
    seedFingerprint: str
    disclaimer: str

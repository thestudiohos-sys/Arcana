from typing import List, Optional
from pydantic import BaseModel, Field
from .enums import EntryType, RitualType, Language

class FreeReadingRequest(BaseModel):
    entryType: EntryType
    storyText: str = Field(..., min_length=3, max_length=500)
    ritualType: RitualType
    selectedCardId: str = Field(..., min_length=1)
    language: Language = Language.KO

class FreeReadingResponse(BaseModel):
    readingId: str
    selectedCardId: str
    headline: str
    currentSituation: str
    possibility: str
    signals: str
    action: str
    talismanMessage: str
    disclaimer: str

class PremiumReadingRequest(BaseModel):
    entryType: EntryType
    storyText: str = Field(..., min_length=3, max_length=500)
    ritualType: RitualType
    cardIds: List[str] = Field(..., min_length=3, max_length=3)
    language: Language = Language.KO

class PremiumCardInterpretation(BaseModel):
    role: str
    cardId: str
    cardName: str
    headline: str
    interpretation: str

class PremiumReadingResponse(BaseModel):
    readingId: str
    cards: List[PremiumCardInterpretation]
    connectionHeadline: str
    cardConnection: str
    deepReadingHeadline: str
    deepReading: str
    emotionalPattern: str
    watchFor: str
    actions: List[str]
    closingMessage: str
    disclaimer: str

from typing import List, Optional
from pydantic import BaseModel, Field
from .enums import EntryType, RitualType, Language, TalismanStyle

class DigitalTalismanRequest(BaseModel):
    entryType: EntryType
    storyText: str = Field(..., min_length=3, max_length=500)
    ritualType: RitualType
    freeCardId: Optional[str] = None
    premiumCardIds: Optional[List[str]] = None
    language: Language = Language.KO

class DigitalTalismanOption(BaseModel):
    id: str
    style: TalismanStyle
    titleKo: str
    titleEn: str
    subtitleKo: str
    subtitleEn: str
    symbolMotif: str
    phraseKo: str
    phraseEn: str
    frameType: str
    primaryColor: str
    accentColor: str
    seedFingerprint: str

class DigitalTalismanResponse(BaseModel):
    options: List[DigitalTalismanOption]
    disclaimer: str

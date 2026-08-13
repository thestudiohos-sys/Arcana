from typing import List, Optional
from pydantic import BaseModel, Field

class GeminiFreeReadingOutput(BaseModel):
    headline: str = Field(..., description="Short emotional title connecting the card and user situation")
    currentSituation: str = Field(..., description="Gentle reflection of current situation through card symbolism")
    possibility: str = Field(..., description="Open perspective or possibility without deterministic fortune-telling")
    signals: str = Field(..., description="Key intuitive signals or aspects worth paying attention to")
    action: str = Field(..., description="One small, practical, grounded action to take")
    talismanMessage: str = Field(..., description="One short comforting phrase to carry forward")

class GeminiPremiumCardItem(BaseModel):
    role: str = Field(..., description="Role title e.g. currentFlow, hiddenMeaning, carryForward")
    headline: str = Field(..., description="Short single-line interpretation summary for this card")
    interpretation: str = Field(..., description="2-4 sentence role interpretation connecting card and user story")

class GeminiPremiumReadingOutput(BaseModel):
    cards: List[GeminiPremiumCardItem] = Field(..., min_length=3, max_length=3, description="Exact 3 card role interpretations")
    connectionHeadline: str = Field(..., description="Single-line headline synthesizing the 3-card narrative arc")
    cardConnection: str = Field(..., description="Narrative paragraph explaining how Card 1 flows into Card 2 and Card 3")
    deepReadingHeadline: str = Field(..., description="Main headline for the deep synthetic reading")
    deepReadingParagraphs: List[str] = Field(..., min_length=2, max_length=4, description="2 to 4 structured reflection paragraphs")
    emotionalPattern: str = Field(..., description="Reflective observation of inner emotional pattern without medical diagnosis")
    watchFor: str = Field(..., description="Grounded aspect to watch out for without fear-mongering")
    actions: List[str] = Field(..., min_length=3, max_length=3, description="Exactly 3 practical real-world action suggestions")
    closingMessage: str = Field(..., description="One powerful closing message to carry forward")

import os
import time
from typing import List
from fastapi import HTTPException
from .base import BaseReadingProvider
from ..models.reading import FreeReadingRequest, FreeReadingResponse, PremiumReadingRequest, PremiumReadingResponse, PremiumCardInterpretation
from ..models.gemini import GeminiFreeReadingOutput, GeminiPremiumReadingOutput
from ..models.enums import Language
from ..services.mock_free_reading import TAROT_CARDS
from ..prompts.reading_prompts import build_free_reading_prompt, build_premium_reading_prompt

# Try importing google-genai
try:
    from google import genai
    from google.genai import types
    HAS_GENAI_SDK = True
except ImportError:
    HAS_GENAI_SDK = False

class GeminiReadingProvider(BaseReadingProvider):
    def __init__(self):
        if not HAS_GENAI_SDK:
            raise HTTPException(
                status_code=503,
                detail="Google GenAI SDK is not installed on backend. Please run pip install google-genai."
            )
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="GEMINI_API_KEY is not configured on the backend server."
            )
        
        self.model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        self.client = genai.Client(api_key=api_key)

    def generate_free_reading(self, req: FreeReadingRequest) -> FreeReadingResponse:
        card_info = TAROT_CARDS.get(req.selectedCardId, {"nameKo": req.selectedCardId, "nameEn": req.selectedCardId, "keyword": "상징"})
        card_name = card_info["nameKo"] if req.language == Language.KO else card_info["nameEn"]
        card_keyword = card_info.get("keyword", "")

        prompt = build_free_reading_prompt(
            entry_type=req.entryType.value,
            story_text=req.storyText,
            ritual_type=req.ritualType.value,
            card_id=req.selectedCardId,
            card_name=card_name,
            card_keyword=card_keyword,
            language=req.language.value,
        )

        try:
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiFreeReadingOutput,
                temperature=0.3,
                max_output_tokens=1000,
            )

            start_time = time.time()
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            duration_ms = int((time.time() - start_time) * 1000)
            print(f"[Gemini API] Free reading generated successfully in {duration_ms}ms (model: {self.model_name})")

            # Parse Structured Output Pydantic Object
            parsed: GeminiFreeReadingOutput = response.parsed

            fixed_disclaimer = (
                "본 리딩은 상징적 해석과 자기 성찰을 위한 엔터테인먼트 콘텐츠이며, 중요한 의료·법률·재정적 결정을 대신하지 않습니다."
                if req.language == Language.KO else
                "This reading is symbolic content for reflection and entertainment and should not replace professional medical, legal, or financial advice."
            )

            return FreeReadingResponse(
                readingId=f"free_ai_{int(time.time()*1000)}",
                selectedCardId=req.selectedCardId,
                headline=parsed.headline,
                currentSituation=parsed.currentSituation,
                possibility=parsed.possibility,
                signals=parsed.signals,
                action=parsed.action,
                talismanMessage=parsed.talismanMessage,
                disclaimer=fixed_disclaimer,
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"[Gemini API Error] Free Reading Generation Failed: {str(e)}")
            raise HTTPException(status_code=502, detail="Failed to generate AI reading from Gemini Provider.")

    def generate_premium_reading(self, req: PremiumReadingRequest) -> PremiumReadingResponse:
        if len(set(req.cardIds)) < 3:
            raise HTTPException(status_code=400, detail="Duplicate premium cards are not allowed.")

        cards_info = []
        for cid in req.cardIds:
            # Copy so the shared TAROT_CARDS entry is never mutated across requests
            info = {**TAROT_CARDS.get(cid, {"nameKo": cid, "nameEn": cid, "keyword": "상징"}), "id": cid}
            cards_info.append(info)

        prompt = build_premium_reading_prompt(
            entry_type=req.entryType.value,
            story_text=req.storyText,
            ritual_type=req.ritualType.value,
            cards_info=cards_info,
            language=req.language.value,
        )

        try:
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiPremiumReadingOutput,
                temperature=0.3,
                max_output_tokens=2500,
            )

            start_time = time.time()
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            duration_ms = int((time.time() - start_time) * 1000)
            print(f"[Gemini API] Premium 3-card reading generated successfully in {duration_ms}ms (model: {self.model_name})")

            parsed: GeminiPremiumReadingOutput = response.parsed

            roles = ["currentFlow", "hiddenMeaning", "carryForward"]
            cards_interp: List[PremiumCardInterpretation] = []
            for i in range(3):
                cid = req.cardIds[i]
                c_name = cards_info[i]["nameKo"] if req.language == Language.KO else cards_info[i]["nameEn"]
                ai_item = parsed.cards[i] if i < len(parsed.cards) else None
                headline = ai_item.headline if ai_item else f"Card {i+1} Role"
                interp = ai_item.interpretation if ai_item else f"Interpretation for {c_name}"

                cards_interp.append(
                    PremiumCardInterpretation(
                        role=roles[i],
                        cardId=cid,
                        cardName=c_name,
                        headline=headline,
                        interpretation=interp,
                    )
                )

            fixed_disclaimer = (
                "본 심층 리딩은 상징적 해석과 자기 성찰을 위한 엔터테인먼트 콘텐츠이며, 단정적 예언이나 전문적 조언을 대신하지 않습니다."
                if req.language == Language.KO else
                "This deep reading is symbolic content for reflection and entertainment and should not replace professional guidance."
            )

            deep_reading_full = "\n\n".join(parsed.deepReadingParagraphs)

            return PremiumReadingResponse(
                readingId=f"premium_ai_{int(time.time()*1000)}",
                cards=cards_interp,
                connectionHeadline=parsed.connectionHeadline,
                cardConnection=parsed.cardConnection,
                deepReadingHeadline=parsed.deepReadingHeadline,
                deepReading=deep_reading_full,
                emotionalPattern=parsed.emotionalPattern,
                watchFor=parsed.watchFor,
                actions=parsed.actions[:3],
                closingMessage=parsed.closingMessage,
                disclaimer=fixed_disclaimer,
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"[Gemini API Error] Premium Reading Generation Failed: {str(e)}")
            raise HTTPException(status_code=502, detail="Failed to generate AI premium reading from Gemini Provider.")

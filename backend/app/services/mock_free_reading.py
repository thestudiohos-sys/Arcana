from typing import Dict, Any
import time
from ..models.reading import FreeReadingRequest, FreeReadingResponse
from ..models.enums import Language

# 13 Tarot Cards Pool Metadata for Backend Context
TAROT_CARDS: Dict[str, Dict[str, Any]] = {
    "the_fool": {"nameKo": "0. 바보", "nameEn": "0. The Fool", "keyword": "새로운 시작"},
    "the_magician": {"nameKo": "I. 마술사", "nameEn": "I. The Magician", "keyword": "창조적 가능성"},
    "the_high_priestess": {"nameKo": "II. 여사제", "nameEn": "II. The High Priestess", "keyword": "직관과 내면"},
    "the_empress": {"nameKo": "III. 여황제", "nameEn": "III. The Empress", "keyword": "풍요와 결실"},
    "the_emperor": {"nameKo": "IV. 황제", "nameEn": "IV. The Emperor", "keyword": "질서와 중심"},
    "the_hierophant": {"nameKo": "V. 교황", "nameEn": "V. The Hierophant", "keyword": "지혜와 가이던스"},
    "the_lovers": {"nameKo": "VI. 연인", "nameEn": "VI. The Lovers", "keyword": "조화와 선택"},
    "the_chariot": {"nameKo": "VII. 전차", "nameEn": "VII. The Chariot", "keyword": "전진과 의지"},
    "the_strength": {"nameKo": "VIII. 힘", "nameEn": "VIII. Strength", "keyword": "부드러운 내면의 힘"},
    "the_hermit": {"nameKo": "IX. 은둔자", "nameEn": "IX. The Hermit", "keyword": "성찰과 등불"},
    "the_star": {"nameKo": "XVII. 별", "nameEn": "XVII. The Star", "keyword": "희망과 영감"},
    "the_moon": {"nameKo": "XVIII. 달", "nameEn": "XVIII. The Moon", "keyword": "감정과 직관"},
    "the_sun": {"nameKo": "XIX. 태양", "nameEn": "XIX. The Sun", "keyword": "명료함과 활력"},
}

def generate_mock_free_reading(req: FreeReadingRequest) -> FreeReadingResponse:
    card_info = TAROT_CARDS.get(req.selectedCardId, {"nameKo": req.selectedCardId, "nameEn": req.selectedCardId, "keyword": "상징"})
    is_ko = req.language == Language.KO

    if is_ko:
        headline = f"✦ {card_info['nameKo']} · {card_info['keyword']}의 상징"
        situation = f"당신이 보여준 상황과 '{card_info['nameKo']}' 카드가 만나 현재 마음의 템포를 차분히 비추어줍니다."
        possibility = "성급하게 답을 내리기보다, 상황이 자연스럽게 자리 잡도록 잠시 시선을 정돈해보세요."
        signals = "내면에서 조용히 들려오는 첫 번째 직관과 마음에 남아 있는 작은 호기심."
        action = "오늘 하루는 스스로에게 부담을 주지 말고, 가장 편안한 마음에 집중해보세요."
        talisman_msg = "조용한 순간 속에 당신이 찾던 명료함이 담겨 있습니다."
        disclaimer = "본 리딩은 개인적 성찰과 엔터테인먼트를 위한 조언이며 미래를 결정하지 않습니다."
    else:
        headline = f"✦ {card_info['nameEn']} · Symbolic Clarity"
        situation = f"Your story connects with {card_info['nameEn']}, gently reflecting your current flow."
        possibility = "Rather than rushing to conclusions, allow room for clarity to evolve naturally."
        signals = "Pay attention to your first intuitive reaction and quiet inner guidance."
        action = "Take a moment today to breathe deeply and trust your inner rhythm."
        talisman_msg = "Clarity awaits in quiet moments of reflection."
        disclaimer = "This reading is for reflection and entertainment only. It does not predict guaranteed future outcomes."

    return FreeReadingResponse(
        readingId=f"free_{int(time.time()*1000)}",
        selectedCardId=req.selectedCardId,
        headline=headline,
        currentSituation=situation,
        possibility=possibility,
        signals=signals,
        action=action,
        talismanMessage=talisman_msg,
        disclaimer=disclaimer,
    )

import time
from typing import List
from fastapi import HTTPException
from ..models.reading import PremiumReadingRequest, PremiumReadingResponse, PremiumCardInterpretation
from ..models.enums import Language
from .mock_free_reading import TAROT_CARDS

def generate_mock_premium_reading(req: PremiumReadingRequest) -> PremiumReadingResponse:
    # Check duplicate cards
    if len(set(req.cardIds)) < 3:
        raise HTTPException(status_code=400, detail="Duplicate premium cards are not allowed.")

    is_ko = req.language == Language.KO
    card1 = TAROT_CARDS.get(req.cardIds[0], {"nameKo": req.cardIds[0], "nameEn": req.cardIds[0]})
    card2 = TAROT_CARDS.get(req.cardIds[1], {"nameKo": req.cardIds[1], "nameEn": req.cardIds[1]})
    card3 = TAROT_CARDS.get(req.cardIds[2], {"nameKo": req.cardIds[2], "nameEn": req.cardIds[2]})

    if is_ko:
        cards_interp = [
            PremiumCardInterpretation(
                role="currentFlow",
                cardId=req.cardIds[0],
                cardName=card1['nameKo'],
                headline="Card 1: 지금의 흐름",
                interpretation=f"'{card1['nameKo']}' 카드는 현재 상황의 중심 에너지와 흐름을 보여줍니다."
            ),
            PremiumCardInterpretation(
                role="hiddenMeaning",
                cardId=req.cardIds[1],
                cardName=card2['nameKo'],
                headline="Card 2: 숨겨진 의미",
                interpretation=f"'{card2['nameKo']}' 카드는 겉으로 드러나지 않은 감정과 관점을 들여다봅니다."
            ),
            PremiumCardInterpretation(
                role="carryForward",
                cardId=req.cardIds[2],
                cardName=card3['nameKo'],
                headline="Card 3: 앞으로 가져갈 메시지",
                interpretation=f"'{card3['nameKo']}' 카드는 이 순간 마음에 품고 나아갈 메시지를 전합니다."
            ),
        ]
        conn_headline = f"{card1['nameKo']} ➔ {card2['nameKo']} ➔ {card3['nameKo']}의 3장 연결 서사"
        conn_text = "첫 번째 카드의 흐름이 두 번째 카드의 성찰을 지나 세 번째 카드의 가이던스로 자연스럽게 이어집니다."
        deep_headline = "당신의 이야기와 3장의 카드가 조화롭게 만난 심층 종합 리딩"
        deep_text = "이 세 장의 조화는 당신이 현재 마주한 고민을 혼자 안고 있기보다, 숨겨진 의미를 이해하며 조용히 전진할 때 더 큰 명료함이 열림을 보여줍니다."
        emo_pattern = "상황에 직면했을 때 급하게 결론짓기보다 한번 가다듬는 차분한 성찰 패턴."
        watch_for = "주변의 서두르는 분위기에 휩쓸려 내면의 소리를 놓치지 않도록 주의해보세요."
        actions = [
            "1. 오늘 저녁 10분간 상황을 한 걸음 떨어져 기록해보기",
            "2. 마음을 가라앉히는 차분한 리추얼 시간 갖기",
            "3. 작은 결정부터 직관을 믿고 하나씩 실행하기"
        ]
        closing = "세 장의 카드가 비추어준 가이던스를 마음에 품고 조용히 전진하세요."
        disclaimer = "본 심층 리딩은 자기 성찰 및 가이던스를 위한 엔터테인먼트 콘텐츠이며, 단정적 예언을 포함하지 않습니다."
    else:
        cards_interp = [
            PremiumCardInterpretation(
                role="currentFlow",
                cardId=req.cardIds[0],
                cardName=card1['nameEn'],
                headline="Card 1: Current Flow",
                interpretation=f"'{card1['nameEn']}' reflects the core momentum of your situation."
            ),
            PremiumCardInterpretation(
                role="hiddenMeaning",
                cardId=req.cardIds[1],
                cardName=card2['nameEn'],
                headline="Card 2: Hidden Meaning",
                interpretation=f"'{card2['nameEn']}' illuminates underlying perspectives and emotions."
            ),
            PremiumCardInterpretation(
                role="carryForward",
                cardId=req.cardIds[2],
                cardName=card3['nameEn'],
                headline="Card 3: Message to Carry Forward",
                interpretation=f"'{card3['nameEn']}' provides guidance to hold as you move forward."
            ),
        ]
        conn_headline = f"3-Card Arc: {card1['nameEn']} ➔ {card2['nameEn']} ➔ {card3['nameEn']}"
        conn_text = "The initial momentum moves through quiet reflection into clear actionable clarity."
        deep_headline = "Deep Synthetic Reading for Your Story"
        deep_text = "The interplay of these three cards invites you to step back, understand hidden nuances, and proceed with calm confidence."
        emo_pattern = "A thoughtful reflection pattern that balances intuition with emotional clarity."
        watch_for = "Avoid letting external urgency distract you from your inner compass."
        actions = [
            "1. Take 10 minutes tonight to journal your reflections.",
            "2. Observe your situation from a calm, grounded stance.",
            "3. Take one practical step aligned with your intuition."
        ]
        closing = "Carry the wisdom of these three cards forward with peace."
        disclaimer = "This deep reading is provided for reflection and entertainment. It does not predict future events."

    return PremiumReadingResponse(
        readingId=f"premium_{int(time.time()*1000)}",
        cards=cards_interp,
        connectionHeadline=conn_headline,
        cardConnection=conn_text,
        deepReadingHeadline=deep_headline,
        deepReading=deep_text,
        emotionalPattern=emo_pattern,
        watchFor=watch_for,
        actions=actions,
        closingMessage=closing,
        disclaimer=disclaimer,
    )

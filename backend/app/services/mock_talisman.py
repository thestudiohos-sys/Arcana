from typing import List
from ..models.talismans import DigitalTalismanRequest, DigitalTalismanResponse, DigitalTalismanOption
from ..models.enums import TalismanStyle, Language, RitualType, EntryType
from .mock_symbolic_numbers import fnv1a_hash_32, LcgPrng

def generate_mock_talisman_options(req: DigitalTalismanRequest) -> DigitalTalismanResponse:
    premium_str = "-".join(req.premiumCardIds) if req.premiumCardIds else ""
    seed_str = f"{req.entryType.value}|{req.storyText.strip()}|{req.ritualType.value}|{req.freeCardId or ''}|{premium_str}"
    
    seed = fnv1a_hash_32(seed_str)
    prng = LcgPrng(seed)
    fingerprint = hex(seed)[2:].zfill(8).upper()

    is_ko = req.language == Language.KO

    # Candidate 1: Radiant
    cand1 = DigitalTalismanOption(
        id=f"talisman_radiant_{fingerprint[:4]}",
        style=TalismanStyle.RADIANT,
        titleKo="빛을 담은 부적",
        titleEn="A Light to Carry",
        subtitleKo="희망과 시작의 기운을 밝히는 상징",
        subtitleEn="Illuminating Hope and New Beginnings",
        symbolMotif="sun_star_rays",
        phraseKo="당신의 조용한 다짐에 차분한 빛이 항상 함께하기를.",
        phraseEn="May quiet warmth always illuminate your journey.",
        frameType="radial_star",
        primaryColor="#c5a059",
        accentColor="#ffd700",
        seedFingerprint=fingerprint,
    )

    # Candidate 2: Guardian
    cand2 = DigitalTalismanOption(
        id=f"talisman_guardian_{fingerprint[2:6]}",
        style=TalismanStyle.GUARDIAN,
        titleKo="마음을 지키는 부적",
        titleEn="A Quiet Guard",
        subtitleKo="내면의 평정과 중심을 보호하는 상징",
        subtitleEn="Shielding Inner Peace and Balance",
        symbolMotif="compass_shield",
        phraseKo="소란한 세상 속에서도 중심을 잃지 않는 은은한 안식.",
        phraseEn="A steady shield of peace amidst a moving world.",
        frameType="layered_octagon",
        primaryColor="#a8b2c1",
        accentColor="#c5a059",
        seedFingerprint=fingerprint,
    )

    # Candidate 3: Mirror
    cand3 = DigitalTalismanOption(
        id=f"talisman_mirror_{fingerprint[4:8]}",
        style=TalismanStyle.MIRROR,
        titleKo="고요를 담은 부적",
        titleEn="A Moment of Balance",
        subtitleKo="스스로를 비추고 성찰하는 투명한 상징",
        subtitleEn="Reflecting Harmony and Deep Clarity",
        symbolMotif="moon_lotus_arch",
        phraseKo="맑게 비치는 거울처럼 스스로의 지혜를 마주하기를.",
        phraseEn="Reflecting your inner wisdom with tranquil clarity.",
        frameType="vertical_arch",
        primaryColor="#9b8bb4",
        accentColor="#e2d4f7",
        seedFingerprint=fingerprint,
    )

    disclaimer = (
        "이 디지털 부적은 당신의 이야기와 카드 선택에서 영감을 받아 만든 상징적 이미지입니다. "
        "실제 행운, 보호, 금전적 결과 또는 특정 사건을 보장하지 않으며, 자기 성찰과 엔터테인먼트를 위한 디지털 이미지입니다."
        if is_ko else
        "This digital talisman is a symbolic visual inspired by your story and card choices. "
        "It does not guarantee luck, protection, financial outcomes, or specific events, and is provided for reflection and entertainment."
    )

    return DigitalTalismanResponse(
        options=[cand1, cand2, cand3],
        disclaimer=disclaimer,
    )

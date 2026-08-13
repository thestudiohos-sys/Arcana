import ctypes
from typing import List
from ..models.numbers import SymbolicNumberRequest, SymbolicNumberResponse
from ..models.enums import NumberGameType

def fnv1a_hash_32(text: str) -> int:
    hash_val = 0x811C9DC5
    for char in text.encode('utf-8'):
        hash_val ^= char
        hash_val = ctypes.c_uint32(hash_val * 0x01000193).value
    return hash_val

class LcgPrng:
    def __init__(self, seed: int):
        self.state = ctypes.c_uint32(seed).value

    def next(self) -> float:
        self.state = ctypes.c_uint32(self.state * 1664525 + 1013904223).value
        return self.state / 4294967296.0

def generate_mock_symbolic_numbers(req: SymbolicNumberRequest) -> SymbolicNumberResponse:
    premium_str = "-".join(req.premiumCardIds) if req.premiumCardIds else ""
    seed_str = f"{req.entryType.value}|{req.storyText.strip()}|{req.ritualType.value}|{req.freeCardId or ''}|{premium_str}"
    
    seed = fnv1a_hash_32(seed_str)
    prng = LcgPrng(seed)

    pool = list(range(1, 46))
    drawn: List[int] = []

    for _ in range(6):
        rand = prng.next()
        index = int(rand * len(pool))
        drawn.append(pool.pop(index))

    drawn.sort()
    fingerprint = hex(seed)[2:].zfill(8).upper()

    disclaimer = (
        "이 숫자는 사용자의 이야기와 카드 선택에서 영감을 받아 생성된 상징적인 엔터테인먼트 전용 번호입니다. "
        "로또 당첨 확률을 높이거나 당첨을 보장하지 않으며, 어떠한 사목적/재물적 예측도 제공하지 않습니다."
    )

    return SymbolicNumberResponse(
        gameType=req.gameType,
        mainNumbers=drawn,
        seedFingerprint=fingerprint,
        disclaimer=disclaimer,
    )

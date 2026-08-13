from enum import Enum

class EntryType(str, Enum):
    DREAM = "DREAM"
    CONCERN = "CONCERN"
    WISH = "WISH"
    RELATIONSHIP = "RELATIONSHIP"
    UNEASY = "UNEASY"
    CUSTOM = "CUSTOM"

class RitualType(str, Enum):
    BLESSING = "blessing"
    RELEASE = "release"
    REFLECTION = "reflection"

class Language(str, Enum):
    KO = "ko"
    EN = "en"

class NumberGameType(str, Enum):
    KR_LOTTO_645 = "kr_lotto_645"

class TalismanStyle(str, Enum):
    RADIANT = "radiant"
    GUARDIAN = "guardian"
    MIRROR = "mirror"

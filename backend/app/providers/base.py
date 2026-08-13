from abc import ABC, abstractmethod
from ..models.reading import FreeReadingRequest, FreeReadingResponse, PremiumReadingRequest, PremiumReadingResponse

class BaseReadingProvider(ABC):
    @abstractmethod
    def generate_free_reading(self, req: FreeReadingRequest) -> FreeReadingResponse:
        pass

    @abstractmethod
    def generate_premium_reading(self, req: PremiumReadingRequest) -> PremiumReadingResponse:
        pass

import os
from fastapi import HTTPException
from .base import BaseReadingProvider
from .mock_provider import MockReadingProvider
from .gemini_provider import GeminiReadingProvider

def get_reading_provider() -> BaseReadingProvider:
    provider_type = os.environ.get("READING_PROVIDER", "mock").lower()

    if provider_type == "mock":
        return MockReadingProvider()
    elif provider_type == "gemini":
        return GeminiReadingProvider()
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid READING_PROVIDER configured: '{provider_type}'. Allowed values: 'mock', 'gemini'."
        )

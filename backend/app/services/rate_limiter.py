import os
import time
from collections import defaultdict
from threading import Lock
from fastapi import HTTPException, Request, Response

def get_client_ip(request: Request) -> str:
    """
    Extract client IP address from FastAPI Request.
    Currently uses request.client.host.
    Designed for easy extension when configuring trusted proxies in deployment.
    """
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"

class InMemoryRateLimiter:
    def __init__(self):
        self._lock = Lock()
        # Storage format: self._requests[endpoint][ip] = list of timestamps
        self._requests = defaultdict(lambda: defaultdict(list))

    def _get_env_int(self, key: str, default: int) -> int:
        val = os.environ.get(key)
        if val is not None:
            try:
                return int(val)
            except ValueError:
                pass
        return default

    def check_rate_limit(self, request: Request, endpoint_type: str):
        """
        endpoint_type: 'free' or 'premium'
        Applies rate limit ONLY if READING_PROVIDER == 'gemini'.
        """
        provider = os.environ.get("READING_PROVIDER", "mock").lower()
        if provider != "gemini":
            # Rate limit applies only to Gemini provider mode
            return

        window_seconds = self._get_env_int("RATE_LIMIT_WINDOW_SECONDS", 600)
        if endpoint_type == "free":
            limit = self._get_env_int("FREE_READING_RATE_LIMIT", 10)
        elif endpoint_type == "premium":
            limit = self._get_env_int("PREMIUM_READING_RATE_LIMIT", 5)
        else:
            return

        client_ip = get_client_ip(request)
        now = time.time()

        with self._lock:
            timestamps = self._requests[endpoint_type][client_ip]
            # Filter out expired timestamps
            cutoff = now - window_seconds
            valid_timestamps = [t for t in timestamps if t > cutoff]

            if len(valid_timestamps) >= limit:
                # Calculate Retry-After in seconds
                oldest = valid_timestamps[0]
                retry_after = int(max(1, oldest + window_seconds - now))
                
                # Cleanup stored timestamps
                self._requests[endpoint_type][client_ip] = valid_timestamps
                
                raise HTTPException(
                    status_code=429,
                    detail="Too many reading requests. Please try again later.",
                    headers={"Retry-After": str(retry_after)}
                )

            valid_timestamps.append(now)
            self._requests[endpoint_type][client_ip] = valid_timestamps

rate_limiter = InMemoryRateLimiter()

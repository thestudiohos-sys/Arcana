from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import readings, numbers, talismans

app = FastAPI(
    title="Arcana by H.O.S Local Mock API",
    description="Development-only local mock backend providing JSON endpoints for Arcana readings, symbolic numbers, and digital talismans.",
    version="0.1.0",
)

# CORS configuration restricted to local dev server origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(readings.router, prefix="/api")
app.include_router(numbers.router, prefix="/api")
app.include_router(talismans.router, prefix="/api")

@app.get("/api/health")
def health_check():
    import os
    provider_name = os.environ.get("READING_PROVIDER", "mock").lower()
    return {
        "status": "ok",
        "service": "arcana-local-api",
        "version": "0.2.0",
        "readingProvider": provider_name
    }

"""
Main FastAPI application for GMU Book Trading Co
"""
import warnings

# Suppress urllib3 OpenSSL warning (doesn't affect functionality)
warnings.filterwarnings("ignore", message=".*urllib3.*")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, books

app = FastAPI(
    title="GMU Book Trading Co API",
    description="Backend API for the GMU Book Trading Co platform",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(books.router, prefix="/api/books", tags=["Books"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "GMU Book Trading Co Backend is running"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to GMU Book Trading Co API",
        "docs": "/docs",
        "health": "/health",
    }

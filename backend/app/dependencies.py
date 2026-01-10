"""
Dependency functions for FastAPI routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from supabase import Client
from app.database import supabase

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency to get the current authenticated user from JWT token
    """
    token = credentials.credentials

    try:
        # Verify token with Supabase
        response = supabase.auth.get_user(token)
        user = response.user

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        return {
            "id": user.id,
            "email": user.email,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
) -> Optional[dict]:
    """
    Optional dependency to get the current authenticated user from JWT token
    Returns None if no token is provided or token is invalid
    """
    if not credentials:
        return None
    
    token = credentials.credentials

    try:
        # Verify token with Supabase
        response = supabase.auth.get_user(token)
        user = response.user

        if not user:
            return None

        return {
            "id": user.id,
            "email": user.email,
        }
    except Exception:
        return None


async def get_supabase_client() -> Client:
    """
    Dependency to get Supabase client
    """
    return supabase

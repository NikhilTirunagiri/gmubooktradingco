"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class BookCondition(str, Enum):
    """Book condition enum"""
    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"


class BookStatus(str, Enum):
    """Book status enum"""
    AVAILABLE = "available"
    SOLD = "sold"
    PENDING = "pending"


class TradeStatus(str, Enum):
    """Trade status enum"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# Authentication Models
class UserSignup(BaseModel):
    """User signup request model - Only @gmu.edu emails allowed"""
    email: EmailStr
    password: str = Field(..., min_length=12, description="Password must be at least 12 characters and not appear in data breaches")
    full_name: Optional[str] = Field(None, max_length=100)

    @field_validator('email')
    @classmethod
    def validate_gmu_email(cls, v: str) -> str:
        """Validate that email is from @gmu.edu domain"""
        if not v.lower().endswith('@gmu.edu'):
            raise ValueError('Only GMU email addresses (@gmu.edu) are allowed')
        return v.lower()


class UserLogin(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def validate_gmu_email(cls, v: str) -> str:
        """Validate that email is from @gmu.edu domain"""
        if not v.lower().endswith('@gmu.edu'):
            raise ValueError('Only GMU email addresses (@gmu.edu) are allowed')
        return v.lower()


class UserResponse(BaseModel):
    """User response model"""
    id: str
    email: str
    full_name: Optional[str] = None
    email_verified: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmailVerificationRequest(BaseModel):
    """Request to resend verification email"""
    email: EmailStr

    @field_validator('email')
    @classmethod
    def validate_gmu_email(cls, v: str) -> str:
        """Validate that email is from @gmu.edu domain"""
        if not v.lower().endswith('@gmu.edu'):
            raise ValueError('Only GMU email addresses (@gmu.edu) are allowed')
        return v.lower()


class VerifyEmailRequest(BaseModel):
    """Request to verify email with token"""
    token: str = Field(..., min_length=1, description="Email verification token")


# Book Models
class BookCreate(BaseModel):
    """Book creation request model"""
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    isbn: Optional[str] = None
    condition: BookCondition
    price: float = Field(..., gt=0)
    description: Optional[str] = None
    images: Optional[List[str]] = []


class BookUpdate(BaseModel):
    """Book update request model"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    author: Optional[str] = Field(None, min_length=1, max_length=100)
    isbn: Optional[str] = None
    condition: Optional[BookCondition] = None
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    images: Optional[List[str]] = None
    status: Optional[BookStatus] = None


class BookResponse(BaseModel):
    """Book response model"""
    id: str
    title: str
    author: str
    isbn: Optional[str]
    condition: str
    price: float
    description: Optional[str]
    seller_id: str
    status: str
    images: Optional[List[str]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookListResponse(BaseModel):
    """Book list response model"""
    books: List[BookResponse]
    count: int


# Trade Models (for future use)
class TradeCreate(BaseModel):
    """Trade creation request model"""
    book_id: str
    seller_id: str


class TradeResponse(BaseModel):
    """Trade response model"""
    id: str
    buyer_id: str
    seller_id: str
    book_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class BookCondition(str, Enum):
    """Book condition enum - matches database schema"""
    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    ACCEPTABLE = "acceptable"


class ListingType(str, Enum):
    """Listing type enum"""
    SALE = "sale"
    RENT = "rent"


class ListingStatus(str, Enum):
    """Listing status enum - matches database schema"""
    ACTIVE = "active"
    SOLD = "sold"
    RENTED = "rented"
    INACTIVE = "inactive"


class RequestStatus(str, Enum):
    """Request status enum"""
    OPEN = "open"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"


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


# Book Models (Metadata only)
class BookCreate(BaseModel):
    """Book metadata creation model"""
    title: str = Field(..., min_length=1, max_length=200)
    author: Optional[str] = None
    isbn: Optional[str] = None


class BookResponse(BaseModel):
    """Book metadata response model"""
    id: str
    title: str
    author: Optional[str]
    isbn: Optional[str]
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


# Listing Models (Actual listings for sale/rent)
class ListingCreate(BaseModel):
    """Listing creation request model"""
    book_id: Optional[str] = None  # Can be None if book doesn't exist yet
    title: str = Field(..., min_length=1, max_length=200)  # Required if book_id is None
    author: Optional[str] = None  # Required if book_id is None
    isbn: Optional[str] = None
    type: ListingType
    price: float = Field(..., gt=0)
    condition: BookCondition
    description: Optional[str] = None
    # Rental-specific fields
    rent_duration_value: Optional[int] = Field(None, gt=0)
    rent_duration_unit: Optional[str] = Field(None, pattern="^(days|weeks|months)$")
    images: Optional[List[str]] = []

    @model_validator(mode='after')
    def validate_rental_fields(self):
        """Validate rental fields are provided when type is rent"""
        if self.type == ListingType.RENT:
            if not self.rent_duration_value:
                raise ValueError('rent_duration_value is required for rental listings')
            if not self.rent_duration_unit:
                raise ValueError('rent_duration_unit is required for rental listings')
        return self


class ListingUpdate(BaseModel):
    """Listing update request model"""
    price: Optional[float] = Field(None, gt=0)
    condition: Optional[BookCondition] = None
    description: Optional[str] = None
    status: Optional[ListingStatus] = None
    rent_duration_value: Optional[int] = Field(None, gt=0)
    rent_duration_unit: Optional[str] = Field(None, pattern="^(days|weeks|months)$")


class ListingResponse(BaseModel):
    """Listing response model with book info"""
    id: str
    user_id: str
    book_id: Optional[str]
    type: str
    price: float
    condition: str
    description: Optional[str]
    rent_duration_value: Optional[int]
    rent_duration_unit: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    # Joined book data
    book_title: Optional[str] = None
    book_author: Optional[str] = None
    book_isbn: Optional[str] = None
    # Images
    images: Optional[List[str]] = []
    # User info
    user_display_name: Optional[str] = None

    class Config:
        from_attributes = True


class ListingListResponse(BaseModel):
    """Listing list response model"""
    listings: List[ListingResponse]
    count: int


# Request Models
class RequestCreate(BaseModel):
    """Request creation model"""
    book_title: str = Field(..., min_length=1, max_length=200)
    author: Optional[str] = None
    isbn: Optional[str] = None
    desired_condition: Optional[BookCondition] = None
    description: Optional[str] = None


class RequestUpdate(BaseModel):
    """Request update model"""
    status: Optional[RequestStatus] = None
    description: Optional[str] = None


class RequestResponse(BaseModel):
    """Request response model"""
    id: str
    user_id: str
    book_title: str
    author: Optional[str]
    isbn: Optional[str]
    desired_condition: Optional[str]
    description: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    user_display_name: Optional[str] = None

    class Config:
        from_attributes = True


class RequestListResponse(BaseModel):
    """Request list response model"""
    requests: List[RequestResponse]
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

"""
Authentication routes with GMU email validation and email verification
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.models import (
    UserSignup,
    UserLogin,
    UserResponse,
    EmailVerificationRequest,
    VerifyEmailRequest,
)
from app.database import supabase, supabase_admin
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    """
    Register a new user with GMU email
    
    Requirements:
    - Email must be @gmu.edu
    - Password must be at least 12 characters
    - Email verification will be sent automatically via Supabase's native email system
    
    Note: Uses Supabase's native email verification system. Users must click the 
    verification link in their email before they can log in. This prevents auto-verification.
    
    IMPORTANT: Ensure Supabase dashboard has "Enable email confirmations" ON and 
    no custom SMTP configured to prevent auto-verification issues.
    """
    import asyncio
    
    try:
        # Email domain validation is handled by Pydantic model
        # Use Supabase's native sign_up() - it automatically sends verification emails
        # and respects Supabase's "Enable email confirmations" setting
        loop = asyncio.get_event_loop()
        
        def signup_user():
            # Use regular sign_up() - it properly sends verification emails
            # and respects Supabase's "Enable email confirmations" setting
            # This is the standard way that prevents auto-verification
            # Uses Supabase's native email system (not custom SMTP)
            return supabase.auth.sign_up(
                {
                    "email": user_data.email,
                    "password": user_data.password,
                    "options": {
                        "data": {
                            "full_name": user_data.full_name or "",
                        },
                        "email_redirect_to": "http://localhost:3000/auth/verify",
                    },
                }
            )
        
        # Use standard timeout for Supabase's native email system
        try:
            response = await asyncio.wait_for(
                loop.run_in_executor(None, signup_user),
                timeout=20.0  # Standard timeout for Supabase native email system
            )
        except asyncio.TimeoutError:
            # Even if timeout, user might have been created
            # Check if user exists and return appropriate message
            try:
                # Try to get user to see if it was created
                users_response = supabase_admin.auth.admin.list_users()
                # list_users() returns a dict with 'users' key, or could be a list
                if isinstance(users_response, dict):
                    users_list = users_response.get('users', [])
                elif isinstance(users_response, list):
                    users_list = users_response
                else:
                    # Try to access as attribute
                    users_list = getattr(users_response, 'users', [])
                
                user_exists = any(
                    u.email and u.email.lower() == user_data.email.lower()
                    for u in users_list
                )
                
                if user_exists:
                    raise HTTPException(
                        status_code=status.HTTP_201_CREATED,
                        detail="Account created but email sending timed out. Please use the resend verification endpoint to receive your verification email.",
                    )
            except:
                pass
            
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Signup request timed out. Please check your internet connection and try again. If the account was created, use the resend verification endpoint.",
            )

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account",
            )

        # Verify user is NOT auto-confirmed (email_confirmed_at should be None)
        if response.user.email_confirmed_at is not None:
            # This shouldn't happen, but if it does, log it
            print(f"WARNING: User {response.user.email} was auto-confirmed during signup")

        # User should be unconfirmed - they must click verification link
        email_verified = response.user.email_confirmed_at is not None

        return {
            "message": "Account created successfully. Please check your email to verify your account.",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "email_verified": email_verified,
            },
            "verification_email_sent": not email_verified,  # Email sent if not verified
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except ValueError as e:
        # Pydantic validation errors (e.g., invalid email domain)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        error_msg = str(e).lower()
        
        # Handle timeout errors
        if "timeout" in error_msg or "timed out" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Connection to Supabase timed out. Please check your internet connection and try again. If the issue persists, the account may have been created - please try logging in.",
            )
        
        # Handle connection errors
        if "connection" in error_msg or "network" in error_msg or "unreachable" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to authentication service. Please check your internet connection and try again.",
            )
        
        # Handle Supabase-specific errors
        if "already registered" in error_msg or "already exists" in error_msg or "user already registered" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )
        
        # Generic error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}",
        )


@router.post("/login", response_model=dict)
async def login(user_data: UserLogin):
    """
    Login a user
    
    Requirements:
    - Email must be @gmu.edu
    - Email must be verified
    """
    try:
        # Email domain validation is handled by Pydantic model
        response = supabase.auth.sign_in_with_password(
            {
                "email": user_data.email,
                "password": user_data.password,
            }
        )

        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        # Check if email is verified
        if not response.user.email_confirmed_at:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified. Please check your email and verify your account before logging in.",
            )

        return {
            "message": "Login successful",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "email_verified": True,
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_at": response.session.expires_at,
            },
        }
    except HTTPException:
        # Re-raise HTTP exceptions (like email not verified)
        raise
    except ValueError as e:
        # Pydantic validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        error_msg = str(e).lower()
        if "invalid" in error_msg or "wrong" in error_msg or "credentials" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}",
        )


@router.post("/logout", response_model=dict)
async def logout():
    """
    Logout the current user
    """
    try:
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Logout failed: {str(e)}",
        )


@router.get("/user", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current user information
    Requires authentication via Bearer token
    """
    try:
        # Get full user details from Supabase
        user_response = supabase_admin.auth.admin.get_user_by_id(current_user["id"])
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        user = user_response.user
        
        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "email_verified": user.email_confirmed_at is not None,
                "created_at": user.created_at,
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user info: {str(e)}",
        )


@router.post("/resend-verification", response_model=dict)
async def resend_verification_email(request: EmailVerificationRequest):
    """
    Resend email verification link
    
    Sends a new verification email to the user's @gmu.edu email address
    using Supabase's native email system.
    """
    import asyncio
    
    try:
        # Email domain validation is handled by Pydantic model
        # Use Supabase's native resend method which sends emails via Supabase's system
        loop = asyncio.get_event_loop()
        
        def resend_email():
            # Use the resend method which sends emails via Supabase's native email system
            # Note: This requires the user to exist and not be confirmed
            return supabase.auth.resend(
                {
                    "type": "signup",
                    "email": request.email,
                }
            )
        
        # Try to resend with standard timeout for Supabase native email system
        try:
            response = await asyncio.wait_for(
                loop.run_in_executor(None, resend_email),
                timeout=20.0  # Standard timeout for Supabase native email system
            )
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Email sending timed out. Please try again later.",
            )
        
        return {
            "message": "Verification email sent successfully. Please check your inbox and spam folder.",
            "email": request.email,
        }
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        error_msg = str(e).lower()
        if "not found" in error_msg or "doesn't exist" in error_msg or "user not found" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found with this email address. Please sign up first.",
            )
        if "already confirmed" in error_msg or "already verified" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already verified. You can log in directly.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to send verification email: {str(e)}",
        )


@router.get("/check-verification", response_model=dict)
async def check_email_verification(email: str = None):
    """
    Check if an email has been verified
    
    This endpoint should be called by the frontend after a user clicks the email
    verification link, especially when Supabase redirects with an error like
    'otp_expired'. Even if the URL shows an error, the user may already be verified.
    
    Usage: GET /api/auth/check-verification?email=user@gmu.edu
    
    Response:
    - email: The user's email address
    - email_verified: Boolean indicating if email is verified
    - verified_at: ISO timestamp of when email was verified (null if not verified)
    
    Frontend Implementation:
    When Supabase redirects to /auth/verify with hash fragments like:
    #error=access_denied&error_code=otp_expired&error_description=...
    
    The frontend should:
    1. Extract the email from the URL (if available) or from user's session/signup flow
    2. Call this endpoint: GET /api/auth/check-verification?email=user@gmu.edu
    3. Check the 'email_verified' field in the response
    4. Show success message if verified=true, or prompt to resend if verified=false
    """
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email parameter is required. Example: /api/auth/check-verification?email=user@gmu.edu",
        )
    
    try:
        # Validate email format
        if not email.lower().endswith('@gmu.edu'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only GMU email addresses (@gmu.edu) are allowed",
            )
        
        # Get user by email using admin client
        users_response = supabase_admin.auth.admin.list_users()
        
        # list_users() returns a dict with 'users' key containing the list of users
        # Handle different return types for compatibility
        if isinstance(users_response, dict):
            users_list = users_response.get('users', [])
        elif isinstance(users_response, list):
            users_list = users_response
        else:
            # Try to access as attribute (in case it's an object)
            users_list = getattr(users_response, 'users', [])
        
        # Find user by email
        user = None
        for u in users_list:
            if u.email and u.email.lower() == email.lower():
                user = u
                break
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found with this email address. Please sign up first.",
            )
        
        is_verified = user.email_confirmed_at is not None
        
        return {
            "email": user.email,
            "email_verified": is_verified,
            "verified_at": user.email_confirmed_at.isoformat() if user.email_confirmed_at else None,
            "message": "Email is verified" if is_verified else "Email not yet verified. Please check your email for the verification link.",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check verification status: {str(e)}",
        )


@router.post("/verify-email", response_model=dict)
async def verify_email(request: VerifyEmailRequest):
    """
    Verify email address using the token from verification email
    
    This endpoint is for programmatic verification.
    Note: Supabase email links use hash fragments that must be handled by frontend JavaScript.
    """
    try:
        # Verify the email token
        response = supabase.auth.verify_otp(
            {
                "token": request.token,
                "type": "email",
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token",
            )

        return {
            "message": "Email verified successfully",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "email_verified": True,
            },
        }
    except Exception as e:
        error_msg = str(e).lower()
        if "invalid" in error_msg or "expired" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token. Please request a new verification email.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email verification failed: {str(e)}",
        )

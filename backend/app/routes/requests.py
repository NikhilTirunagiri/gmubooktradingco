"""
Request management routes - handles book requests
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional
from app.models import (
    RequestCreate,
    RequestUpdate,
    RequestResponse,
    RequestListResponse,
    RequestStatus,
)
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=RequestListResponse)
async def get_requests(
    status: Optional[RequestStatus] = Query(default=RequestStatus.OPEN, alias="status"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    """
    Get all requests with optional filtering
    """
    try:
        query = supabase.table("requests").select("*")
        
        if status:
            query = query.eq("status", status.value)
        
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        
        response = query.execute()
        
        requests_data = response.data if response.data else []
        
        # Transform data
        requests = []
        for req in requests_data:
            # Get user display name
            user_display_name = None
            if req.get("user_id"):
                try:
                    profile_response = (
                        supabase.table("profiles")
                        .select("display_name")
                        .eq("id", req["user_id"])
                        .single()
                        .execute()
                    )
                    if profile_response.data:
                        user_display_name = profile_response.data.get("display_name")
                except:
                    pass
            
            requests.append({
                **req,
                "user_display_name": user_display_name,
            })
        
        return RequestListResponse(requests=requests, count=len(requests))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch requests: {str(e)}",
        )


@router.get("/{request_id}", response_model=RequestResponse)
async def get_request(request_id: str):
    """
    Get a specific request by ID
    """
    try:
        response = (
            supabase.table("requests")
            .select("*")
            .eq("id", request_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found",
            )

        req = response.data
        
        # Get user display name
        user_display_name = None
        if req.get("user_id"):
            try:
                profile_response = (
                    supabase.table("profiles")
                    .select("display_name")
                    .eq("id", req["user_id"])
                    .single()
                    .execute()
                )
                if profile_response.data:
                    user_display_name = profile_response.data.get("display_name")
            except:
                pass
        
        return RequestResponse(
            **{
                **req,
                "user_display_name": user_display_name,
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch request: {str(e)}",
        )


@router.post("/", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    request_data: RequestCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new request (requires authentication)
    """
    try:
        request_dict = {
            "user_id": current_user["id"],
            "book_title": request_data.book_title,
            "author": request_data.author,
            "isbn": request_data.isbn,
            "desired_condition": request_data.desired_condition.value if request_data.desired_condition else None,
            "description": request_data.description,
            "status": RequestStatus.OPEN.value,
        }

        response = (
            supabase.table("requests")
            .insert(request_dict)
            .select()
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create request",
            )

        # Fetch with joins
        return await get_request(response.data["id"])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create request: {str(e)}",
        )


@router.put("/{request_id}", response_model=RequestResponse)
async def update_request(
    request_id: str,
    request_data: RequestUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Update a request (requires authentication, owner only)
    """
    try:
        # Check if request exists and user owns it
        existing_response = (
            supabase.table("requests")
            .select("user_id")
            .eq("id", request_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own requests",
            )

        # Update request
        update_dict = request_data.model_dump(exclude_unset=True)
        if "status" in update_dict:
            update_dict["status"] = update_dict["status"].value

        response = (
            supabase.table("requests")
            .update(update_dict)
            .eq("id", request_id)
            .select()
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update request",
            )

        # Fetch with joins
        return await get_request(request_id)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update request: {str(e)}",
        )


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a request (requires authentication, owner only)
    """
    try:
        # Check if request exists and user owns it
        existing_response = (
            supabase.table("requests")
            .select("user_id")
            .eq("id", request_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own requests",
            )

        # Delete request
        supabase.table("requests").delete().eq("id", request_id).execute()

        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete request: {str(e)}",
        )

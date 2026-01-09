"""
Listing management routes - handles book listings for sale/rent
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional
from app.models import (
    ListingCreate,
    ListingUpdate,
    ListingResponse,
    ListingListResponse,
    ListingStatus,
    ListingType,
)
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=ListingListResponse)
async def get_listings(
    status: Optional[ListingStatus] = Query(default=ListingStatus.ACTIVE, alias="status"),
    type: Optional[ListingType] = Query(default=None, alias="type"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    """
    Get all listings with optional filtering
    Returns listings with joined book and user data
    """
    try:
        # Build query
        query = supabase.table("listings").select("*")
        
        if status:
            query = query.eq("status", status.value)
        if type:
            query = query.eq("type", type.value)
        
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        
        response = query.execute()
        
        listings_data = response.data if response.data else []
        
        # Transform data to match ListingResponse model
        listings = []
        for listing in listings_data:
            # Get images for this listing
            images_response = (
                supabase.table("listing_images")
                .select("image_url")
                .eq("listing_id", listing["id"])
                .order("created_at")
                .execute()
            )
            images = [img["image_url"] for img in (images_response.data or [])]
            
            # Get book data if book_id exists
            book_title = None
            book_author = None
            book_isbn = None
            if listing.get("book_id"):
                try:
                    book_response = (
                        supabase.table("books")
                        .select("title, author, isbn")
                        .eq("id", listing["book_id"])
                        .single()
                        .execute()
                    )
                    if book_response.data:
                        book_title = book_response.data.get("title")
                        book_author = book_response.data.get("author")
                        book_isbn = book_response.data.get("isbn")
                except:
                    pass
            
            # Get user display name
            user_display_name = None
            if listing.get("user_id"):
                try:
                    profile_response = (
                        supabase.table("profiles")
                        .select("display_name")
                        .eq("id", listing["user_id"])
                        .single()
                        .execute()
                    )
                    if profile_response.data:
                        user_display_name = profile_response.data.get("display_name")
                except:
                    pass
            
            listings.append({
                **listing,
                "book_title": book_title,
                "book_author": book_author,
                "book_isbn": book_isbn,
                "user_display_name": user_display_name,
                "images": images,
            })
        
        return ListingListResponse(listings=listings, count=len(listings))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listings: {str(e)}",
        )


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(listing_id: str):
    """
    Get a specific listing by ID with book and user data
    """
    try:
        response = (
            supabase.table("listings")
            .select("*")
            .eq("id", listing_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

        listing = response.data
        
        # Get images
        images_response = (
            supabase.table("listing_images")
            .select("image_url")
            .eq("listing_id", listing_id)
            .order("created_at")
            .execute()
        )
        images = [img["image_url"] for img in (images_response.data or [])]
        
        # Get book data if book_id exists
        book_title = None
        book_author = None
        book_isbn = None
        if listing.get("book_id"):
            try:
                book_response = (
                    supabase.table("books")
                    .select("title, author, isbn")
                    .eq("id", listing["book_id"])
                    .single()
                    .execute()
                )
                if book_response.data:
                    book_title = book_response.data.get("title")
                    book_author = book_response.data.get("author")
                    book_isbn = book_response.data.get("isbn")
            except:
                pass
        
        # Get user display name
        user_display_name = None
        if listing.get("user_id"):
            try:
                profile_response = (
                    supabase.table("profiles")
                    .select("display_name")
                    .eq("id", listing["user_id"])
                    .single()
                    .execute()
                )
                if profile_response.data:
                    user_display_name = profile_response.data.get("display_name")
            except:
                pass
        
        listing_response = {
            **listing,
            "book_title": book_title,
            "book_author": book_author,
            "book_isbn": book_isbn,
            "user_display_name": user_display_name,
            "images": images,
        }

        return ListingResponse(**listing_response)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listing: {str(e)}",
        )


@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_data: ListingCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new listing (requires authentication)
    Creates book metadata if book_id is not provided
    """
    try:
        book_id = listing_data.book_id
        
        # If no book_id provided, create book metadata first
        if not book_id:
            book_dict = {
                "title": listing_data.title,
                "author": listing_data.author,
                "isbn": listing_data.isbn,
            }
            book_response = (
                supabase.table("books")
                .insert(book_dict)
                .select()
                .single()
                .execute()
            )
            book_id = book_response.data["id"]
        
        # Create listing
        listing_dict = {
            "user_id": current_user["id"],
            "book_id": book_id,
            "type": listing_data.type.value,
            "price": listing_data.price,
            "condition": listing_data.condition.value,
            "description": listing_data.description,
            "status": ListingStatus.ACTIVE.value,
        }
        
        # Add rental fields if type is rent
        if listing_data.type == ListingType.RENT:
            listing_dict["rent_duration_value"] = listing_data.rent_duration_value
            listing_dict["rent_duration_unit"] = listing_data.rent_duration_unit
        
        listing_response = (
            supabase.table("listings")
            .insert(listing_dict)
            .select()
            .single()
            .execute()
        )
        
        if not listing_response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create listing",
            )
        
        listing_id = listing_response.data["id"]
        
        # Add images if provided
        if listing_data.images:
            image_records = [
                {"listing_id": listing_id, "image_url": img_url}
                for img_url in listing_data.images
            ]
            supabase.table("listing_images").insert(image_records).execute()
        
        # Fetch complete listing with joins
        return await get_listing(listing_id)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create listing: {str(e)}",
        )


@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: str,
    listing_data: ListingUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Update a listing (requires authentication, owner only)
    """
    try:
        # Check if listing exists and user owns it
        existing_response = (
            supabase.table("listings")
            .select("user_id")
            .eq("id", listing_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own listings",
            )

        # Update listing
        update_dict = listing_data.model_dump(exclude_unset=True)
        if "status" in update_dict:
            update_dict["status"] = update_dict["status"].value
        
        response = (
            supabase.table("listings")
            .update(update_dict)
            .eq("id", listing_id)
            .select()
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update listing",
            )

        # Fetch complete listing with joins
        return await get_listing(listing_id)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update listing: {str(e)}",
        )


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a listing (requires authentication, owner only)
    Images are automatically deleted via CASCADE
    """
    try:
        # Check if listing exists and user owns it
        existing_response = (
            supabase.table("listings")
            .select("user_id")
            .eq("id", listing_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own listings",
            )

        # Delete listing (images cascade automatically)
        supabase.table("listings").delete().eq("id", listing_id).execute()

        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete listing: {str(e)}",
        )


@router.post("/{listing_id}/images", status_code=status.HTTP_201_CREATED)
async def add_listing_images(
    listing_id: str,
    image_urls: list[str],
    current_user: dict = Depends(get_current_user),
):
    """
    Add images to a listing (requires authentication, owner only)
    """
    try:
        # Check ownership
        existing_response = (
            supabase.table("listings")
            .select("user_id")
            .eq("id", listing_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only add images to your own listings",
            )

        # Add images
        image_records = [
            {"listing_id": listing_id, "image_url": img_url}
            for img_url in image_urls
        ]
        supabase.table("listing_images").insert(image_records).execute()

        return {"message": "Images added successfully", "count": len(image_urls)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add images: {str(e)}",
        )


@router.delete("/{listing_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing_image(
    listing_id: str,
    image_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete an image from a listing (requires authentication, owner only)
    """
    try:
        # Check ownership
        existing_response = (
            supabase.table("listings")
            .select("user_id")
            .eq("id", listing_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found",
            )

        if existing_response.data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete images from your own listings",
            )

        # Delete image
        supabase.table("listing_images").delete().eq("id", image_id).execute()

        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {str(e)}",
        )

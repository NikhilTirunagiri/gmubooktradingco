"""
Book management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional
from app.models import (
    BookCreate,
    BookUpdate,
    BookResponse,
    BookListResponse,
    BookStatus,
)
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=BookListResponse)
async def get_books(
    status: Optional[BookStatus] = Query(default=BookStatus.AVAILABLE, alias="status"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    """
    Get all books with optional filtering
    """
    try:
        response = (
            supabase.table("books")
            .select("*")
            .eq("status", status.value)
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        books = response.data if response.data else []
        return BookListResponse(books=books, count=len(books))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch books: {str(e)}",
        )


@router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    """
    Get a specific book by ID
    """
    try:
        response = (
            supabase.table("books").select("*").eq("id", book_id).single().execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Book not found",
            )

        return BookResponse(**response.data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch book: {str(e)}",
        )


@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    book_data: BookCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new book listing (requires authentication)
    """
    try:
        book_dict = book_data.model_dump()
        book_dict["seller_id"] = current_user["id"]
        book_dict["status"] = "available"
        book_dict["images"] = book_dict.get("images", [])

        response = (
            supabase.table("books").insert(book_dict).select().single().execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create book listing",
            )

        return BookResponse(**response.data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create book listing: {str(e)}",
        )


@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: str,
    book_data: BookUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Update a book listing (requires authentication, owner only)
    """
    try:
        # Check if book exists and user owns it
        existing_response = (
            supabase.table("books")
            .select("seller_id")
            .eq("id", book_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Book not found",
            )

        if existing_response.data["seller_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own books",
            )

        # Update book
        update_dict = book_data.model_dump(exclude_unset=True)
        response = (
            supabase.table("books")
            .update(update_dict)
            .eq("id", book_id)
            .select()
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update book listing",
            )

        return BookResponse(**response.data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update book listing: {str(e)}",
        )


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a book listing (requires authentication, owner only)
    """
    try:
        # Check if book exists and user owns it
        existing_response = (
            supabase.table("books")
            .select("seller_id")
            .eq("id", book_id)
            .single()
            .execute()
        )

        if not existing_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Book not found",
            )

        if existing_response.data["seller_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own books",
            )

        # Delete book
        supabase.table("books").delete().eq("id", book_id).execute()

        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete book listing: {str(e)}",
        )

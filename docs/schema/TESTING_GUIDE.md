# Testing Guide - GMU Book Trading Co

This guide explains how to test the updated backend API with the new database schema.

## Overview

The backend has been updated to work with the new schema:
- **books**: Metadata only (title, author, isbn)
- **listings**: Actual listings for sale/rent (with user_id, book_id, price, condition, etc.)
- **listing_images**: Separate table for listing images
- **requests**: User requests for books
- **conversations**: Messaging conversations
- **messages**: Individual messages
- **conversation_participants**: Participants in conversations

## New API Endpoints

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/{listing_id}` - Get specific listing
- `POST /api/listings` - Create listing (requires auth)
- `PUT /api/listings/{listing_id}` - Update listing (requires auth, owner only)
- `DELETE /api/listings/{listing_id}` - Delete listing (requires auth, owner only)
- `POST /api/listings/{listing_id}/images` - Add images to listing
- `DELETE /api/listings/{listing_id}/images/{image_id}` - Delete image

### Requests
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/{request_id}` - Get specific request
- `POST /api/requests` - Create request (requires auth)
- `PUT /api/requests/{request_id}` - Update request (requires auth, owner only)
- `DELETE /api/requests/{request_id}` - Delete request (requires auth, owner only)

## Quick Start - CURL Commands

**See `CURL_COMMANDS.md` for all curl commands to test the API.**

Quick example:
```bash
# Set API base
export API_BASE="http://localhost:8000"

# Sign up
curl -X POST "$API_BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmu.edu", "password": "Password123!", "full_name": "User"}'

# Login and get token
TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmu.edu", "password": "Password123!"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Create listing
curl -X POST "$API_BASE/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Book", "author": "Author", "type": "sale", "price": 25.00, "condition": "good"}'
```

## Testing Methods

### Method 1: SQL Test Data (Quick Setup)

1. **Get your test user IDs:**
   ```sql
   SELECT id, email FROM auth.users;
   ```

2. **Update the SQL script:**
   - Open `TEST_DATA.sql`
   - Replace `'YOUR_USER_ID_1'` and `'YOUR_USER_ID_2'` with actual user IDs

3. **Run the script in Supabase SQL Editor:**
   - Copy the entire `TEST_DATA.sql` file
   - Paste into Supabase SQL Editor
   - Execute

4. **Verify data:**
   ```sql
   -- Check listings
   SELECT l.*, b.title as book_title, p.display_name as seller_name
   FROM listings l
   LEFT JOIN books b ON l.book_id = b.id
   LEFT JOIN profiles p ON l.user_id = p.id;
   
   -- Check requests
   SELECT r.*, p.display_name as requester_name
   FROM requests r
   LEFT JOIN profiles p ON r.user_id = p.id;
   ```

### Method 2: Python API Test Script (Comprehensive Testing)

This method tests all CRUD operations via the API.

1. **Install dependencies:**
   ```bash
   cd backend
   pip install httpx
   ```

2. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Create test users first:**
   - Sign up 2 test users via the API or Supabase Auth
   - Update `test_api_data.py` with their emails:
     ```python
     TEST_USER_1_EMAIL = "your-test-user-1@gmu.edu"
     TEST_USER_1_PASSWORD = "YourPassword123!"
     TEST_USER_2_EMAIL = "your-test-user-2@gmu.edu"
     TEST_USER_2_PASSWORD = "YourPassword123!"
     ```

4. **Run the test script:**
   ```bash
   python test_api_data.py
   ```

5. **What it tests:**
   - User signup/login
   - Creating listings (sale and rent)
   - Getting listings
   - Updating listings
   - Creating requests
   - Updating requests
   - Unauthorized access prevention
   - Delete operations

## Example API Calls

### Create a Sale Listing

```bash
curl -X POST "http://localhost:8000/api/listings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Algorithms",
    "author": "Thomas H. Cormen",
    "isbn": "9780262033848",
    "type": "sale",
    "price": 45.99,
    "condition": "like_new",
    "description": "Excellent condition, barely used",
    "images": ["https://example.com/image1.jpg"]
  }'
```

### Create a Rental Listing

```bash
curl -X POST "http://localhost:8000/api/listings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Patterns",
    "author": "Gang of Four",
    "type": "rent",
    "price": 15.00,
    "condition": "new",
    "description": "Brand new book",
    "rent_duration_value": 3,
    "rent_duration_unit": "months",
    "images": []
  }'
```

### Create a Request

```bash
curl -X POST "http://localhost:8000/api/requests" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "book_title": "Database Systems",
    "author": "Ramez Elmasri",
    "isbn": "9780133970777",
    "desired_condition": "good",
    "description": "Looking for Database Systems textbook"
  }'
```

### Get All Listings

```bash
curl "http://localhost:8000/api/listings?status=active&type=sale"
```

## Testing Policies

To verify RLS policies are working:

1. **Test unauthorized access:**
   - Create a listing as User 1
   - Try to update/delete it as User 2
   - Should get 403 Forbidden

2. **Test authorized access:**
   - Create a listing as User 1
   - Update/delete it as User 1
   - Should succeed

3. **Test listing_images ownership:**
   - Try to add images to User 2's listing as User 1
   - Should get 403 Forbidden

## Troubleshooting

### "Listing not found" errors
- Check if RLS is enabled on all tables
- Verify user is authenticated (check token)
- Check if listing exists in database

### "403 Forbidden" errors
- Verify ownership policies are working
- Check if user_id matches listing owner
- Ensure RLS is enabled

### Foreign key errors
- Make sure book_id exists in books table
- Make sure user_id exists in profiles table
- Profiles should be auto-created by trigger

### Test script errors
- Make sure backend server is running
- Check API_BASE_URL matches your server
- Verify test user emails are correct
- Ensure users are verified (email verification)

## Next Steps

After testing:
1. Verify all CRUD operations work
2. Test policy enforcement (unauthorized access)
3. Test with real image URLs (Supabase Storage)
4. Implement conversations/messages endpoints
5. Add frontend integration

## Cleanup

To remove test data:

```sql
-- Remove all test data
DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations);
DELETE FROM conversation_participants;
DELETE FROM conversations;
DELETE FROM listing_images;
DELETE FROM listings;
DELETE FROM requests;
DELETE FROM books WHERE title IN ('Introduction to Algorithms', 'Clean Code', 'Design Patterns', 'Database Systems', 'Operating System Concepts');
```

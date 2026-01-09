# CURL Commands for Testing API

Quick reference for testing all API endpoints using curl commands.

## Setup

Set your API base URL:
```bash
export API_BASE="http://localhost:8000"
```

## Authentication

### 1. Sign Up
```bash
curl -X POST "$API_BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@gmu.edu",
    "password": "TestPassword123!",
    "full_name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@gmu.edu",
    "password": "TestPassword123!"
  }'
```

**Save the token from response:**
```bash
export TOKEN="your_access_token_here"
```

### 3. Get Current User
```bash
curl -X GET "$API_BASE/api/auth/user" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Logout
```bash
curl -X POST "$API_BASE/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN"
```

## Listings

### 1. Create Sale Listing
```bash
curl -X POST "$API_BASE/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
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

### 2. Create Rental Listing
```bash
curl -X POST "$API_BASE/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Patterns",
    "author": "Gang of Four",
    "isbn": "9780201633610",
    "type": "rent",
    "price": 15.00,
    "condition": "new",
    "description": "Brand new book, perfect for one semester",
    "rent_duration_value": 3,
    "rent_duration_unit": "months",
    "images": []
  }'
```

### 3. Get All Listings
```bash
# Get all active listings
curl "$API_BASE/api/listings?status=active"

# Get all sale listings
curl "$API_BASE/api/listings?status=active&type=sale"

# Get all rental listings
curl "$API_BASE/api/listings?status=active&type=rent"

# With pagination
curl "$API_BASE/api/listings?status=active&limit=10&offset=0"
```

### 4. Get Specific Listing
```bash
curl "$API_BASE/api/listings/LISTING_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Listing
```bash
curl -X PUT "$API_BASE/api/listings/LISTING_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 40.00,
    "description": "Updated description"
  }'
```

### 6. Delete Listing
```bash
curl -X DELETE "$API_BASE/api/listings/LISTING_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Add Images to Listing
```bash
curl -X POST "$API_BASE/api/listings/LISTING_ID/images" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
```

### 8. Delete Image from Listing
```bash
curl -X DELETE "$API_BASE/api/listings/LISTING_ID/images/IMAGE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Requests

### 1. Create Request
```bash
curl -X POST "$API_BASE/api/requests" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "book_title": "Database Systems",
    "author": "Ramez Elmasri",
    "isbn": "9780133970777",
    "desired_condition": "good",
    "description": "Looking for Database Systems textbook"
  }'
```

### 2. Get All Requests
```bash
# Get all open requests
curl "$API_BASE/api/requests?status=open"

# Get all fulfilled requests
curl "$API_BASE/api/requests?status=fulfilled"

# With pagination
curl "$API_BASE/api/requests?status=open&limit=10&offset=0"
```

### 3. Get Specific Request
```bash
curl "$API_BASE/api/requests/REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Request
```bash
curl -X PUT "$API_BASE/api/requests/REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "fulfilled"
  }'
```

### 5. Delete Request
```bash
curl -X DELETE "$API_BASE/api/requests/REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Health Check

```bash
curl "$API_BASE/health"
```

## Example Workflow

```bash
# 1. Set API base
export API_BASE="http://localhost:8000"

# 2. Sign up
curl -X POST "$API_BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmu.edu", "password": "Password123!", "full_name": "User"}'

# 3. Login and save token
TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmu.edu", "password": "Password123!"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 4. Create listing
curl -X POST "$API_BASE/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "type": "sale",
    "price": 25.00,
    "condition": "good",
    "description": "Test description"
  }'

# 5. Get listings
curl "$API_BASE/api/listings?status=active"
```

## Notes

- Replace `LISTING_ID`, `REQUEST_ID`, `IMAGE_ID` with actual IDs from responses
- All authenticated endpoints require `Authorization: Bearer $TOKEN` header
- Email must be verified before login (check Supabase dashboard)
- Condition values: `new`, `like_new`, `good`, `acceptable`
- Listing types: `sale`, `rent`
- Listing status: `active`, `sold`, `rented`, `inactive`
- Request status: `open`, `fulfilled`, `cancelled`

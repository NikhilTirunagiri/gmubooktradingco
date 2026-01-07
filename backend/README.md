# GMU Book Trading Co - Backend

Backend API for the GMU Book Trading Co platform, built with FastAPI, Python, and Supabase.

## Features

- 🔐 **GMU-Only Authentication**: Email domain restriction (@gmu.edu only)
- ✅ **Email Verification**: Required before login for security
- 📚 Book listing management (CRUD operations)
- 🛡️ JWT-based authentication middleware
- 🚀 FastAPI with automatic API documentation
- 📝 Pydantic models for data validation
- 🔒 CORS and security middleware

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- A Supabase project (get one at [supabase.com](https://supabase.com))

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Or use a virtual environment (recommended):**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up Supabase

#### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `gmubooktradingco` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region
5. Click "Create new project"
6. Wait for the project to be set up (takes 1-2 minutes)

#### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

#### Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_books_seller_id ON public.books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_trades_buyer_id ON public.trades(buyer_id);
CREATE INDEX IF NOT EXISTS idx_trades_seller_id ON public.trades(seller_id);
CREATE INDEX IF NOT EXISTS idx_trades_book_id ON public.trades(book_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for books table
CREATE POLICY "Anyone can view available books"
  ON public.books FOR SELECT
  USING (status = 'available');

CREATE POLICY "Users can view their own books"
  ON public.books FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can create their own books"
  ON public.books FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own books"
  ON public.books FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own books"
  ON public.books FOR DELETE
  USING (auth.uid() = seller_id);

-- RLS Policies for trades table
CREATE POLICY "Users can view their own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create trades"
  ON public.trades FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update their trades"
  ON public.trades FOR UPDATE
  USING (auth.uid() = seller_id);
```

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

#### Step 4: Configure Authentication (REQUIRED)

1. **Disable Custom SMTP (IMPORTANT)**:
   - Go to **Settings** → **Auth** → **SMTP Settings** in Supabase dashboard
   - **CRITICAL**: If custom SMTP (Gmail, etc.) is configured, **DISABLE IT**
   - **MUST USE**: Supabase's native email system (no custom SMTP)
   - Custom SMTP can cause auto-verification issues where users are verified before clicking the link

2. Go to **Authentication** → **Providers** → **Email** in Supabase dashboard
3. **CRITICAL SETTINGS**:
   - ✅ **Enable "Email" provider** - Must be ON
   - ✅ **Enable "Confirm email"** - Must be ON (this prevents auto-verification)
   - ✅ **Secure email change** - Recommended ON
4. **Why this matters**: 
   - If "Confirm email" is OFF, users can log in without verification. It MUST be ON.
   - Custom SMTP can cause auto-verification. Use Supabase's native email system instead.

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   PORT=8000
   HOST=0.0.0.0
   ENVIRONMENT=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

   **Important**: Replace the placeholder values with your actual Supabase credentials from Step 2.

### 4. Run the Development Server

```bash
# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using the run script (if you create one)
python -m uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

### 5. Access API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/user` - Get current user (requires Bearer token)
- `GET /api/auth/check-verification?email=user@gmu.edu` - Check if email is verified (for frontend verification page)
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/verify-email` - Verify email with token (programmatic)

### Books

- `GET /api/books` - Get all available books (with optional query params: `status`, `limit`, `offset`)
- `GET /api/books/{book_id}` - Get a specific book
- `POST /api/books` - Create a new book listing (requires authentication)
- `PUT /api/books/{book_id}` - Update a book listing (requires authentication, owner only)
- `DELETE /api/books/{book_id}` - Delete a book listing (requires authentication, owner only)

### Health Check

- `GET /health` - Check if the server is running
- `GET /` - Root endpoint with API information

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Supabase client configuration
│   ├── models.py            # Pydantic models for validation
│   ├── dependencies.py      # FastAPI dependencies (auth, etc.)
│   └── routes/
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       └── books.py         # Book management routes
├── .env.example             # Example environment variables
├── .python-version          # Python version specification
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Authentication Flow

1. User signs up/logs in via `/api/auth/signup` or `/api/auth/login`
2. Supabase returns a JWT token in the response
3. Frontend stores the token (e.g., in localStorage or cookies)
4. Frontend includes the token in subsequent requests: `Authorization: Bearer <token>`
5. Backend dependency (`get_current_user`) verifies the token and provides user info

## Development

### Running Tests (when implemented)

```bash
pytest
```

### Code Formatting

```bash
# Using black (if installed)
black app/

# Using autopep8 (if installed)
autopep8 --in-place --recursive app/
```

## Production Deployment

For production, use a production ASGI server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or use a process manager like:
- **Gunicorn** with Uvicorn workers
- **Docker** with a production-ready image
- **Cloud platforms** (Heroku, Railway, Render, etc.)

## Email Verification

### For Frontend Developers

When implementing the email verification page, **always check the actual verification status via the backend API**, even if Supabase redirects with an error in the URL.

See **[FRONTEND_VERIFICATION_GUIDE.md](./FRONTEND_VERIFICATION_GUIDE.md)** for complete implementation instructions.

**Key Points:**
- Supabase may redirect with `error=otp_expired` even though the user is already verified
- Always call `GET /api/auth/check-verification?email=user@gmu.edu` to check real status
- Store user email during signup so you can retrieve it on the verification page

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure you're in the virtual environment and dependencies are installed
2. **Supabase connection errors**: Verify your `.env` file has correct credentials
3. **CORS errors**: Check `ALLOWED_ORIGINS` in your `.env` file
4. **Database errors**: Ensure you've run the SQL schema setup in Supabase
5. **Email verification shows error but user is verified**: This is expected behavior. Frontend must check verification status via backend API (see FRONTEND_VERIFICATION_GUIDE.md)

## Next Steps

- [ ] Add image upload functionality for book listings
- [ ] Implement trade/transaction management routes
- [ ] Add search and filtering for books
- [ ] Set up email notifications
- [ ] Add rate limiting
- [ ] Implement pagination improvements
- [ ] Add request validation with more detailed error messages
- [ ] Set up logging
- [ ] Add unit and integration tests

## License

ISC

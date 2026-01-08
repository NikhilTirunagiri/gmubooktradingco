# Quick Start Guide - GMU Book Trading Co

This guide will help you get both the frontend and backend running on your machine.

## Prerequisites

- **Backend**: Python 3.11+, pip, Supabase account
- **Frontend**: Node.js 18+, npm

## Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=8000
   HOST=0.0.0.0
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

5. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

## Step 2: Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Step 3: Test Authentication

1. **Open the frontend:** Navigate to `http://localhost:3000`

2. **Go to Auth page:** Click on the auth link or navigate to `http://localhost:3000/auth`

3. **Sign Up:**
   - Use a GMU email address (must end with `@gmu.edu`)
   - Password must be at least 12 characters
   - Fill in your full name
   - Click "Create Account"

4. **Verify Email:**
   - Check your email inbox for the verification email from Supabase
   - Click the verification link
   - You'll be redirected to the verification page

5. **Login:**
   - After email verification, go back to the auth page
   - Enter your email and password
   - Click "Sign In"

## Troubleshooting

### Backend Issues

- **Port already in use:** Change the `PORT` in `.env` or kill the process using port 8000
- **Supabase connection errors:** Verify your Supabase credentials in `.env`
- **CORS errors:** Ensure `ALLOWED_ORIGINS` includes `http://localhost:3000`

### Frontend Issues

- **Cannot connect to backend:** 
  - Verify backend is running on port 8000
  - Check `NEXT_PUBLIC_API_URL` in `.env.local`
  - Test backend health: `curl http://localhost:8000/health`

- **Authentication not working:**
  - Check browser console for errors
  - Verify Supabase email verification is enabled in Supabase dashboard
  - Ensure email domain is `@gmu.edu`

- **Build errors:**
  - Clear `.next` folder: `rm -rf .next`
  - Reinstall dependencies: `rm -rf node_modules && npm install`

## Development Workflow

1. **Backend changes:** The server auto-reloads with `--reload` flag
2. **Frontend changes:** Next.js hot-reloads automatically
3. **API changes:** Update `src/lib/api.ts` in frontend
4. **New routes:** Add to `src/app/` following Next.js App Router conventions

## Next Steps

- Explore the marketplace page
- Add book listing functionality
- Implement user profile pages
- Add search and filter features

For detailed documentation, see:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

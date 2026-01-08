# GMU Book Trading Co - Frontend

Frontend application for the GMU Book Trading Co platform, built with Next.js 15, React 19, and TypeScript.

## Features

- 🔐 **Authentication**: Sign up and login with GMU email verification
- 📧 **Email Verification**: Handles Supabase email verification links
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔄 **State Management**: React Context for authentication state
- 🚀 **Next.js 15**: Latest Next.js with App Router

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Backend API running (see backend README)

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `frontend` directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: If your backend is running on a different port or URL, update this accordingly.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # Authentication pages
│   │   │   ├── page.tsx  # Login/Signup page
│   │   │   └── verify/   # Email verification page
│   │   └── ...
│   ├── components/       # React components
│   ├── contexts/         # React Context providers
│   │   └── AuthContext.tsx
│   └── lib/              # Utility functions
│       ├── api.ts        # API client
│       └── utils.ts      # Helper functions
├── public/               # Static assets
└── package.json
```

## Authentication Flow

1. **Sign Up**: User creates account with GMU email (@gmu.edu)
2. **Email Verification**: User receives verification email from Supabase
3. **Verify Email**: User clicks link in email, redirected to `/auth/verify`
4. **Login**: After verification, user can log in
5. **Session**: JWT token stored in localStorage for authenticated requests

## API Integration

The frontend communicates with the backend API through the `apiClient` utility (`src/lib/api.ts`). All API calls are centralized here for easy maintenance.

### Available API Methods

- `signup(data)` - Create new user account
- `login(data)` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get authenticated user info
- `resendVerification(email)` - Resend verification email
- `checkVerification(email)` - Check if email is verified

## Development

### Key Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Context**: State management

### Adding New Features

1. Create components in `src/components/`
2. Add API methods to `src/lib/api.ts` if needed
3. Create pages in `src/app/` following Next.js App Router conventions
4. Use `useAuth()` hook from `AuthContext` for authentication state

## Troubleshooting

### Backend Connection Issues

- Ensure backend is running on the port specified in `NEXT_PUBLIC_API_URL`
- Check CORS settings in backend `config.py`
- Verify backend health endpoint: `http://localhost:8000/health`

### Authentication Issues

- Check browser console for errors
- Verify Supabase credentials in backend
- Ensure email verification is enabled in Supabase dashboard
- Check that email domain validation is working (@gmu.edu only)

### Build Issues

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## License

See main project README for license information.

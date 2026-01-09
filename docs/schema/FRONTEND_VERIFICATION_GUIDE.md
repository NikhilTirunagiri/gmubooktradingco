# Frontend Email Verification Implementation Guide

## Overview

This guide explains how the frontend should properly handle Supabase email verification redirects, especially when encountering the `otp_expired` error.

## The Issue

When users click the email verification link, Supabase may redirect to your frontend with an error in the URL hash:
```
http://localhost:3000/auth/verify#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

**Important**: Even though the URL shows an error, the user may already be verified in Supabase. This happens because:
1. Supabase verifies the user server-side when the link is clicked
2. Then Supabase tries to redirect with session tokens in hash fragments
3. The OTP token may be expired/consumed, causing the error message
4. But the user is already verified, so the error is misleading

## The Solution

The frontend must check the **actual verification status** via the backend API, regardless of what the URL shows.

## Implementation Steps

### Step 1: Create the Verification Page

Create a page at `/auth/verify` (or whatever route you're using) that handles the Supabase redirect.

### Step 2: Extract Information from URL

When the page loads, extract information from the URL hash fragments:

```typescript
// Example: Extract from URL hash
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const error = hashParams.get('error');
const errorCode = hashParams.get('error_code');
const errorDescription = hashParams.get('error_description');
const accessToken = hashParams.get('access_token');
const type = hashParams.get('type');
```

### Step 3: Get User Email

You need to know which user is trying to verify. Options:

**Option A: Store email during signup**
```typescript
// After signup, store email in localStorage or session
localStorage.setItem('pendingVerificationEmail', userData.email);

// On verification page, retrieve it
const email = localStorage.getItem('pendingVerificationEmail');
```

**Option B: Extract from error description**
```typescript
// Sometimes email is in error_description
const emailMatch = errorDescription?.match(/[\w\.-]+@[\w\.-]+\.\w+/);
const email = emailMatch ? emailMatch[0] : null;
```

**Option C: Use Supabase session (if available)**
```typescript
// If user has a session, get email from there
const { data: { user } } = await supabase.auth.getUser();
const email = user?.email;
```

### Step 4: Check Actual Verification Status

**Always call the backend API to check the real verification status**, even if the URL shows an error:

```typescript
async function checkVerificationStatus(email: string) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/auth/check-verification?email=${encodeURIComponent(email)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check verification status');
    }
    
    const data = await response.json();
    return data; // { email, email_verified, verified_at, message }
  } catch (error) {
    console.error('Error checking verification:', error);
    throw error;
  }
}
```

### Step 5: Handle the Response

Based on the backend response, show appropriate UI:

```typescript
const verificationData = await checkVerificationStatus(email);

if (verificationData.email_verified) {
  // User is verified! Show success message
  // Clear pending verification email from storage
  localStorage.removeItem('pendingVerificationEmail');
  // Redirect to login or dashboard
} else {
  // User is not verified yet
  // Show message: "Please check your email for the verification link"
  // Optionally provide a "Resend verification email" button
}
```

## Complete Example Implementation

```typescript
// app/auth/verify/page.tsx (Next.js App Router example)
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'verified' | 'not_verified' | 'error'>('checking');
  const [message, setMessage] = useState('Checking verification status...');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function handleVerification() {
      try {
        // Get email from localStorage (stored during signup)
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        
        // Or extract from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorDescription = hashParams.get('error_description');
        
        // Try to get email from various sources
        let userEmail = pendingEmail;
        if (!userEmail && errorDescription) {
          const emailMatch = errorDescription.match(/[\w\.-]+@[\w\.-]+\.\w+/);
          userEmail = emailMatch ? emailMatch[0] : null;
        }
        
        if (!userEmail) {
          setStatus('error');
          setMessage('Unable to determine which email to verify. Please try logging in or contact support.');
          return;
        }
        
        setEmail(userEmail);
        
        // Check actual verification status via backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/check-verification?email=${encodeURIComponent(userEmail)}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to check verification status');
        }
        
        const data = await response.json();
        
        if (data.email_verified) {
          setStatus('verified');
          setMessage('Email verified successfully! You can now log in.');
          localStorage.removeItem('pendingVerificationEmail');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setStatus('not_verified');
          setMessage('Email not yet verified. Please check your email for the verification link.');
        }
      } catch (error) {
        console.error('Verification check error:', error);
        setStatus('error');
        setMessage('An error occurred while checking verification status. Please try again.');
      }
    }
    
    handleVerification();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {status === 'checking' && (
          <p className="text-gray-600">Checking verification status...</p>
        )}
        {status === 'verified' && (
          <div className="text-green-600">
            <p className="mb-2">✓ {message}</p>
            <p className="text-sm">Redirecting to login...</p>
          </div>
        )}
        {status === 'not_verified' && (
          <div className="text-yellow-600">
            <p className="mb-4">{message}</p>
            {email && (
              <button
                onClick={async () => {
                  // Call resend verification endpoint
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/resend-verification`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    }
                  );
                  if (response.ok) {
                    alert('Verification email resent! Please check your inbox.');
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}
        {status === 'error' && (
          <p className="text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
```

## Important Notes

1. **Always check backend status**: Never rely solely on the URL error message. Always call `/api/auth/check-verification` to get the real status.

2. **Store email during signup**: After successful signup, store the user's email in localStorage or session storage so you can retrieve it on the verification page.

3. **Handle both success and error cases**: The URL might show success (with access_token) or error (with error_code). Always verify via backend.

4. **Provide resend option**: If verification fails, provide a button to resend the verification email using `/api/auth/resend-verification`.

5. **Clear stored data**: After successful verification, clear any stored pending verification email.

## Backend API Endpoints

- `GET /api/auth/check-verification?email=user@gmu.edu` - Check if email is verified
- `POST /api/auth/resend-verification` - Resend verification email

## Testing

1. Sign up a new user
2. Check email and click verification link
3. Should redirect to `/auth/verify`
4. Page should call backend to check status
5. Should show success message if verified, or prompt to resend if not

## Production Considerations

- Update `email_redirect_to` in signup to use your production frontend URL
- Ensure production frontend URL is added to Supabase's allowed redirect URLs
- Use environment variables for API URLs
- Add proper error boundaries and loading states

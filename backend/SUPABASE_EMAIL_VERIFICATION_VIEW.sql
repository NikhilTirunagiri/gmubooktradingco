-- SQL to create a view showing email verification status
-- Run this in your Supabase SQL Editor to see email verification status

-- Create a view that shows user email verification status
CREATE OR REPLACE VIEW public.user_verification_status AS
SELECT 
    id,
    email,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN true
        ELSE false
    END AS email_verified,
    created_at,
    last_sign_in_at,
    updated_at
FROM auth.users
ORDER BY created_at DESC;

-- Grant access to the view (adjust permissions as needed)
GRANT SELECT ON public.user_verification_status TO authenticated;
GRANT SELECT ON public.user_verification_status TO anon;

-- Query to see all users and their verification status
-- SELECT * FROM public.user_verification_status;

-- Query to see only unverified users
-- SELECT * FROM public.user_verification_status WHERE email_verified = false;

-- Query to see only verified users
-- SELECT * FROM public.user_verification_status WHERE email_verified = true;

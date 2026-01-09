-- ============================================================================
-- SUPABASE MIGRATION SCRIPT - FIX EXISTING SETUP
-- ============================================================================
-- This script fixes issues in your existing Supabase setup
-- Safe to run on existing tables and policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUMS (if they don't exist)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('sale', 'rent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('active', 'sold', 'rented', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_condition AS ENUM ('new', 'like_new', 'good', 'acceptable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('open', 'fulfilled', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. CREATE CONVERSATION_PARTICIPANTS TABLE (if it doesn't exist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- ============================================================================
-- 3. DROP AND RECREATE POLICIES WITH PROPER OWNERSHIP CHECKS
-- ============================================================================

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Profiles are viewable by logged-in users" ON profiles;
CREATE POLICY "Profiles are viewable by logged-in users"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- BOOKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Books are readable by logged-in users" ON books;
CREATE POLICY "Books are readable by logged-in users"
ON books FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can add books" ON books;
CREATE POLICY "Users can add books"
ON books FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- LISTINGS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Listings are readable by logged-in users" ON listings;
CREATE POLICY "Listings are readable by logged-in users"
ON listings FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create their own listings" ON listings;
CREATE POLICY "Users can create their own listings"
ON listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
CREATE POLICY "Users can update their own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;
CREATE POLICY "Users can delete their own listings"
ON listings FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- LISTING IMAGES POLICIES (FIXED - with ownership check via join)
-- ============================================================================

DROP POLICY IF EXISTS "Listing images are readable by logged-in users" ON listing_images;
CREATE POLICY "Listing images are readable by logged-in users"
ON listing_images FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can add images to their own listings" ON listing_images;
CREATE POLICY "Users can add images to their own listings"
ON listing_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM listings
    WHERE listings.id = listing_images.listing_id
    AND listings.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete images from their own listings" ON listing_images;
CREATE POLICY "Users can delete images from their own listings"
ON listing_images FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM listings
    WHERE listings.id = listing_images.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- ============================================================================
-- REQUESTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Requests are readable by logged-in users" ON requests;
CREATE POLICY "Requests are readable by logged-in users"
ON requests FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create their own requests" ON requests;
CREATE POLICY "Users can create their own requests"
ON requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own requests" ON requests;
CREATE POLICY "Users can update their own requests"
ON requests FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own requests" ON requests;
CREATE POLICY "Users can delete their own requests"
ON requests FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- CONVERSATIONS POLICIES (ADDING MISSING UPDATE/DELETE)
-- ============================================================================

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Drop old SELECT policy if it exists
DROP POLICY IF EXISTS "Users can read conversations they are part of" ON conversations;

-- Create new SELECT policy using conversation_participants (if table exists)
-- Otherwise, fall back to checking messages
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        EXECUTE '
        CREATE POLICY "Users can read conversations they are part of"
        ON conversations FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = conversations.id
            AND conversation_participants.user_id = auth.uid()
          )
        )';
    ELSE
        EXECUTE '
        CREATE POLICY "Users can read conversations they are part of"
        ON conversations FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM messages
            WHERE messages.conversation_id = conversations.id
            AND messages.sender_id = auth.uid()
          )
        )';
    END IF;
END $$;

-- Add UPDATE policy (was missing)
DROP POLICY IF EXISTS "Users can update conversations they are part of" ON conversations;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        EXECUTE '
        CREATE POLICY "Users can update conversations they are part of"
        ON conversations FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = conversations.id
            AND conversation_participants.user_id = auth.uid()
          )
        )';
    ELSE
        EXECUTE '
        CREATE POLICY "Users can update conversations they are part of"
        ON conversations FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM messages
            WHERE messages.conversation_id = conversations.id
            AND messages.sender_id = auth.uid()
          )
        )';
    END IF;
END $$;

-- Add DELETE policy (was missing)
DROP POLICY IF EXISTS "Users can delete conversations they are part of" ON conversations;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        EXECUTE '
        CREATE POLICY "Users can delete conversations they are part of"
        ON conversations FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = conversations.id
            AND conversation_participants.user_id = auth.uid()
          )
        )';
    ELSE
        EXECUTE '
        CREATE POLICY "Users can delete conversations they are part of"
        ON conversations FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM messages
            WHERE messages.conversation_id = conversations.id
            AND messages.sender_id = auth.uid()
          )
        )';
    END IF;
END $$;

-- ============================================================================
-- MESSAGES POLICIES (ADDING MISSING UPDATE/DELETE)
-- ============================================================================

DROP POLICY IF EXISTS "Users can read messages in their conversations" ON messages;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        EXECUTE '
        CREATE POLICY "Users can read messages in their conversations"
        ON messages FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
            AND conversation_participants.user_id = auth.uid()
          )
        )';
    ELSE
        EXECUTE '
        CREATE POLICY "Users can read messages in their conversations"
        ON messages FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM messages m2
            WHERE m2.conversation_id = messages.conversation_id
            AND m2.sender_id = auth.uid()
          )
        )';
    END IF;
END $$;

DROP POLICY IF EXISTS "Users can send messages as themselves" ON messages;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        EXECUTE '
        CREATE POLICY "Users can send messages as themselves"
        ON messages FOR INSERT
        WITH CHECK (
          auth.uid() = sender_id
          AND EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
            AND conversation_participants.user_id = auth.uid()
          )
        )';
    ELSE
        EXECUTE '
        CREATE POLICY "Users can send messages as themselves"
        ON messages FOR INSERT
        WITH CHECK (auth.uid() = sender_id)';
    END IF;
END $$;

-- Add UPDATE policy (was missing)
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- Add DELETE policy (was missing)
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (auth.uid() = sender_id);

-- ============================================================================
-- CONVERSATION PARTICIPANTS POLICIES (if table exists)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants') THEN
        -- Enable RLS if not already enabled
        ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Users can read participants of their conversations" ON conversation_participants;
        DROP POLICY IF EXISTS "Users can add themselves to conversations" ON conversation_participants;
        DROP POLICY IF EXISTS "Users can remove themselves from conversations" ON conversation_participants;
        
        -- Create policies
        EXECUTE '
        CREATE POLICY "Users can read participants of their conversations"
        ON conversation_participants FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM conversation_participants cp2
            WHERE cp2.conversation_id = conversation_participants.conversation_id
            AND cp2.user_id = auth.uid()
          )
        )';
        
        EXECUTE '
        CREATE POLICY "Users can add themselves to conversations"
        ON conversation_participants FOR INSERT
        WITH CHECK (auth.uid() = user_id)';
        
        EXECUTE '
        CREATE POLICY "Users can remove themselves from conversations"
        ON conversation_participants FOR DELETE
        USING (auth.uid() = user_id)';
    END IF;
END $$;

-- ============================================================================
-- 4. CREATE INDEXES (IF NOT EXISTS - safe to run multiple times)
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_is_active ON books(is_active);

-- Listings indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_book_id ON listings(book_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_user_status ON listings(user_id, status);

-- Listing images indexes
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_created_at ON listing_images(created_at);

-- Requests indexes
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_user_status ON requests(user_id, status);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_listing_id ON conversations(listing_id);
CREATE INDEX IF NOT EXISTS idx_conversations_request_id ON conversations(request_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Conversation participants indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_conversation ON conversation_participants(user_id, conversation_id);

-- ============================================================================
-- 5. CREATE/REPLACE TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_requests_updated_at ON requests;
CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICATION QUERIES (Run these after the migration to verify)
-- ============================================================================

-- Check RLS is enabled on all tables
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'books', 'listings', 'listing_images', 'requests', 'conversations', 'messages', 'conversation_participants');

-- Check policies exist
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. This script is safe to run multiple times
-- 2. It will drop and recreate policies with proper ownership checks
-- 3. It adds missing indexes and triggers
-- 4. It creates conversation_participants table if it doesn't exist
-- 5. After running, verify RLS is enabled on all tables in Supabase dashboard
-- 6. Test policies by creating test users and verifying access
-- ============================================================================

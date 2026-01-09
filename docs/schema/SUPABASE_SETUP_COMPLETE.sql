-- ============================================================================
-- COMPLETE SUPABASE SETUP FOR GMU BOOK TRADING CO
-- ============================================================================
-- This file contains the complete database schema, policies, indexes, and triggers
-- Use this to set up your Supabase database correctly
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE listing_type AS ENUM ('sale', 'rent');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'rented', 'inactive');
CREATE TYPE book_condition AS ENUM ('new', 'like_new', 'good', 'acceptable');
CREATE TYPE request_status AS ENUM ('open', 'fulfilled', 'cancelled');

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- BOOKS TABLE (Metadata only)
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  isbn text,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- LISTINGS TABLE (Core table for buy/sell/rent)
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id),
  type listing_type NOT NULL,
  price numeric(10,2) NOT NULL,
  condition book_condition NOT NULL,
  description text,
  
  -- rental-specific
  rent_duration_value integer,
  rent_duration_unit text CHECK (rent_duration_unit IN ('days','weeks','months')),
  
  status listing_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- LISTING IMAGES TABLE
CREATE TABLE IF NOT EXISTS listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- REQUESTS TABLE
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_title text NOT NULL,
  author text,
  isbn text,
  desired_condition book_condition,
  description text,
  status request_status DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id),
  request_id uuid REFERENCES requests(id),
  created_at timestamptz DEFAULT now(),
  
  -- ensures convo is tied to one context
  CHECK (
    (listing_id IS NOT NULL AND request_id IS NULL)
    OR
    (listing_id IS NULL AND request_id IS NOT NULL)
  )
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- CONVERSATION PARTICIPANTS (RECOMMENDED - makes policies easier)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
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

-- Conversation participants indexes
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_conversation ON conversation_participants(user_id, conversation_id);

-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for listings
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for requests
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

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. POLICIES
-- ============================================================================

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Profiles are viewable by logged-in users
CREATE POLICY "Profiles are viewable by logged-in users"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Users can create their own profile
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- BOOKS POLICIES
-- ============================================================================

-- Books are readable by logged-in users
CREATE POLICY "Books are readable by logged-in users"
ON books FOR SELECT
USING (auth.role() = 'authenticated');

-- Users can add books (anyone can add book metadata)
CREATE POLICY "Users can add books"
ON books FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- LISTINGS POLICIES
-- ============================================================================

-- Listings are readable by logged-in users
CREATE POLICY "Listings are readable by logged-in users"
ON listings FOR SELECT
USING (auth.role() = 'authenticated');

-- Users can create their own listings
CREATE POLICY "Users can create their own listings"
ON listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
ON listings FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- LISTING IMAGES POLICIES
-- ============================================================================

-- Listing images are readable by logged-in users
CREATE POLICY "Listing images are readable by logged-in users"
ON listing_images FOR SELECT
USING (auth.role() = 'authenticated');

-- Users can add images to their own listings
CREATE POLICY "Users can add images to their own listings"
ON listing_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM listings
    WHERE listings.id = listing_images.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- Users can delete images from their own listings
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

-- Requests are readable by logged-in users
CREATE POLICY "Requests are readable by logged-in users"
ON requests FOR SELECT
USING (auth.role() = 'authenticated');

-- Users can create their own requests
CREATE POLICY "Users can create their own requests"
ON requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own requests
CREATE POLICY "Users can update their own requests"
ON requests FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own requests
CREATE POLICY "Users can delete their own requests"
ON requests FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- CONVERSATIONS POLICIES
-- ============================================================================

-- Users can create conversations
CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can read conversations they are part of (via conversation_participants)
CREATE POLICY "Users can read conversations they are part of"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Users can update conversations they are part of (e.g., mark as read)
CREATE POLICY "Users can update conversations they are part of"
ON conversations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Users can delete conversations they are part of
CREATE POLICY "Users can delete conversations they are part of"
ON conversations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================

-- Users can read messages in their conversations
CREATE POLICY "Users can read messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Users can send messages as themselves
CREATE POLICY "Users can send messages as themselves"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (auth.uid() = sender_id);

-- ============================================================================
-- CONVERSATION PARTICIPANTS POLICIES
-- ============================================================================

-- Users can read participants of conversations they are part of
CREATE POLICY "Users can read participants of their conversations"
ON conversation_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = conversation_participants.conversation_id
    AND cp2.user_id = auth.uid()
  )
);

-- Users can add themselves to conversations (when creating a conversation)
CREATE POLICY "Users can add themselves to conversations"
ON conversation_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove themselves from conversations
CREATE POLICY "Users can remove themselves from conversations"
ON conversation_participants FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Make sure to run this script in the Supabase SQL Editor
-- 2. After running, verify RLS is enabled on all tables
-- 3. Test policies by creating test users and verifying access
-- 4. The conversation_participants table is recommended but optional
--    If you don't use it, you'll need to modify the conversation policies
-- 5. When a conversation is created, make sure to add participants:
--    INSERT INTO conversation_participants (conversation_id, user_id)
--    VALUES (conversation_id, user1_id), (conversation_id, user2_id);
-- ============================================================================

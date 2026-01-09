-- ============================================================================
-- TEST DATA SCRIPT FOR GMU BOOK TRADING CO
-- ============================================================================
-- This script creates test data to verify the database schema and policies
-- IMPORTANT: You need to have at least 2 test users created via Supabase Auth
-- Replace the user IDs below with actual user IDs from auth.users table
-- ============================================================================

-- First, get your test user IDs from auth.users table:
-- SELECT id, email FROM auth.users;

-- Replace these UUIDs with your actual test user IDs
-- Example: '00000000-0000-0000-0000-000000000001' should be replaced with real user ID

-- ============================================================================
-- STEP 1: Get Test User IDs
-- ============================================================================
-- Run this first to get your user IDs:
-- SELECT id, email FROM auth.users LIMIT 2;

-- ============================================================================
-- STEP 2: Update Profiles (if needed)
-- ============================================================================
-- Profiles should be auto-created by trigger, but you can update display names:
-- UPDATE profiles SET display_name = 'Test User 1' WHERE id = 'YOUR_USER_ID_1';
-- UPDATE profiles SET display_name = 'Test User 2' WHERE id = 'YOUR_USER_ID_2';

-- ============================================================================
-- STEP 3: Create Test Books (Metadata)
-- ============================================================================

INSERT INTO books (title, author, isbn) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848'),
('Clean Code', 'Robert C. Martin', '9780132350884'),
('Design Patterns', 'Gang of Four', '9780201633610'),
('Database Systems', 'Ramez Elmasri', '9780133970777'),
('Operating System Concepts', 'Abraham Silberschatz', '9781118063330')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 4: Create Test Listings
-- ============================================================================
-- NOTE: Replace 'YOUR_USER_ID_1' and 'YOUR_USER_ID_2' with actual user IDs

-- Get book IDs first
DO $$
DECLARE
    book1_id uuid;
    book2_id uuid;
    book3_id uuid;
    user1_id uuid := 'febe49ed-3ac7-46a8-9897-50a756fad1c1';  -- REPLACE THIS
    user2_id uuid := '816918da-e8bc-4877-b258-d60befeb2c30';  -- REPLACE THIS
    listing1_id uuid;
    listing2_id uuid;
    listing3_id uuid;
BEGIN
    -- Get book IDs
    SELECT id INTO book1_id FROM books WHERE title = 'Introduction to Algorithms' LIMIT 1;
    SELECT id INTO book2_id FROM books WHERE title = 'Clean Code' LIMIT 1;
    SELECT id INTO book3_id FROM books WHERE title = 'Design Patterns' LIMIT 1;
    
    -- Create sale listings
    INSERT INTO listings (user_id, book_id, type, price, condition, description, status)
    VALUES
    (user1_id, book1_id, 'sale', 45.99, 'like_new', 'Excellent condition, barely used', 'active')
    RETURNING id INTO listing1_id;
    
    INSERT INTO listings (user_id, book_id, type, price, condition, description, status)
    VALUES
    (user2_id, book2_id, 'sale', 35.00, 'good', 'Some highlighting, but in good shape', 'active')
    RETURNING id INTO listing2_id;
    
    -- Create rental listing
    INSERT INTO listings (user_id, book_id, type, price, condition, description, rent_duration_value, rent_duration_unit, status)
    VALUES
    (user1_id, book3_id, 'rent', 15.00, 'new', 'Brand new book, perfect for one semester', 3, 'months', 'active')
    RETURNING id INTO listing3_id;
    
    -- Add test images (using placeholder URLs - replace with actual image URLs)
    INSERT INTO listing_images (listing_id, image_url) VALUES
    (listing1_id, 'https://via.placeholder.com/400x600?text=Book+1'),
    (listing1_id, 'https://via.placeholder.com/400x600?text=Book+1+Back'),
    (listing2_id, 'https://via.placeholder.com/400x600?text=Book+2'),
    (listing3_id, 'https://via.placeholder.com/400x600?text=Book+3');
    
    RAISE NOTICE 'Test listings created successfully!';
    RAISE NOTICE 'Listing 1 ID: %', listing1_id;
    RAISE NOTICE 'Listing 2 ID: %', listing2_id;
    RAISE NOTICE 'Listing 3 ID: %', listing3_id;
END $$;

-- ============================================================================
-- STEP 5: Create Test Requests
-- ============================================================================
-- NOTE: Replace 'YOUR_USER_ID_1' and 'YOUR_USER_ID_2' with actual user IDs

INSERT INTO requests (user_id, book_title, author, isbn, desired_condition, description, status) VALUES
('febe49ed-3ac7-46a8-9897-50a756fad1c1', 'Database Systems', 'Ramez Elmasri', '9780133970777', 'good', 'Looking for Database Systems textbook for CS 550', 'open'),
('816918da-e8bc-4877-b258-d60befeb2c30', 'Operating System Concepts', 'Abraham Silberschatz', NULL, 'acceptable', 'Need OS book, any condition is fine', 'open')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 6: Create Test Conversations and Messages
-- ============================================================================
-- NOTE: Replace 'YOUR_USER_ID_1' and 'YOUR_USER_ID_2' with actual user IDs

DO $$
DECLARE
    user1_id uuid := 'febe49ed-3ac7-46a8-9897-50a756fad1c1';  -- REPLACE THIS
    user2_id uuid := '816918da-e8bc-4877-b258-d60befeb2c30';  -- REPLACE THIS
    listing1_id uuid;
    conversation1_id uuid;
BEGIN
    -- Get a listing ID
    SELECT id INTO listing1_id FROM listings LIMIT 1;
    
    -- Create conversation
    INSERT INTO conversations (listing_id, request_id)
    VALUES (listing1_id, NULL)
    RETURNING id INTO conversation1_id;
    
    -- Add participants
    INSERT INTO conversation_participants (conversation_id, user_id) VALUES
    (conversation1_id, user1_id),
    (conversation1_id, user2_id)
    ON CONFLICT DO NOTHING;
    
    -- Create messages
    INSERT INTO messages (conversation_id, sender_id, body) VALUES
    (conversation1_id, user1_id, 'Hi! Is this book still available?'),
    (conversation1_id, user2_id, 'Yes, it is! When would you like to pick it up?'),
    (conversation1_id, user1_id, 'Can we meet tomorrow at the library?'),
    (conversation1_id, user2_id, 'Sure, 2 PM works for me!');
    
    RAISE NOTICE 'Test conversation and messages created!';
    RAISE NOTICE 'Conversation ID: %', conversation1_id;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all listings
-- SELECT l.*, b.title as book_title, p.display_name as seller_name
-- FROM listings l
-- LEFT JOIN books b ON l.book_id = b.id
-- LEFT JOIN profiles p ON l.user_id = p.id;

-- Check all requests
-- SELECT r.*, p.display_name as requester_name
-- FROM requests r
-- LEFT JOIN profiles p ON r.user_id = p.id;

-- Check conversations with message counts
-- SELECT c.*, COUNT(m.id) as message_count
-- FROM conversations c
-- LEFT JOIN messages m ON c.id = m.conversation_id
-- GROUP BY c.id;

-- Check listing images
-- SELECT li.*, l.user_id, p.display_name as owner_name
-- FROM listing_images li
-- JOIN listings l ON li.listing_id = l.id
-- JOIN profiles p ON l.user_id = p.id;

-- ============================================================================
-- CLEANUP (Run this to remove test data)
-- ============================================================================
-- DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations);
-- DELETE FROM conversation_participants;
-- DELETE FROM conversations;
-- DELETE FROM listing_images;
-- DELETE FROM listings;
-- DELETE FROM requests;
-- DELETE FROM books WHERE title IN ('Introduction to Algorithms', 'Clean Code', 'Design Patterns', 'Database Systems', 'Operating System Concepts');

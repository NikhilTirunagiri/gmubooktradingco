# Database Schema & Policies Analysis

## Overview
This document analyzes the proposed Supabase schema and policies against the current codebase implementation to identify gaps and issues.

---

## 🔴 Critical Issues

### 1. **Schema Mismatch: Books vs Listings**
**Current Code Expects:**
- Single `books` table with: `seller_id`, `price`, `status`, `images[]`, `condition`, `title`, `author`, `isbn`

**Proposed Schema:**
- `books` table: metadata only (title, author, isbn, is_active)
- `listings` table: actual listings (user_id, book_id, type, price, condition, status, rental fields)
- `listing_images` table: separate table for images

**Impact:** The entire backend code needs to be refactored to use the new schema structure.

---

### 2. **Enum Value Mismatches**

#### Book Condition
- **Code:** `new`, `like_new`, `good`, `fair`, `poor`
- **Schema:** `new`, `like_new`, `good`, `acceptable`
- **Issue:** `fair`/`poor` vs `acceptable` - need to standardize

#### Listing Status
- **Code:** `available`, `sold`, `pending`
- **Schema:** `active`, `sold`, `rented`, `inactive`
- **Issue:** Different statuses - need to align

---

## ⚠️ Missing Policies

### 1. **profiles table**
- ✅ SELECT: All logged-in users can view profiles
- ✅ INSERT: Users can create their own profile
- ✅ UPDATE: Users can update their own profile
- ❌ **MISSING:** Policy to ensure users can only update their OWN profile (needs `user_id = auth.uid()` check)

### 2. **listings table**
- ✅ SELECT: All logged-in users can view listings
- ✅ INSERT: Users can create their own listings
- ✅ UPDATE: Users can update their own listings
- ✅ DELETE: Users can delete their own listings
- ❌ **MISSING:** Policies need explicit `user_id = auth.uid()` checks for UPDATE/DELETE

### 3. **listing_images table**
- ✅ SELECT: All logged-in users can view images
- ✅ INSERT: Users can add images to their own listings
- ✅ DELETE: Users can delete images from their own listings
- ❌ **MISSING:** Policy needs to verify ownership via `listing_id` → check if `listing.user_id = auth.uid()`

### 4. **conversations table**
- ✅ INSERT: Users can create conversations
- ✅ SELECT: Users can read conversations they are part of
- ❌ **MISSING:** UPDATE policy (users might want to mark conversations as read/archived)
- ❌ **MISSING:** DELETE policy (users might want to delete conversations)

### 5. **messages table**
- ✅ SELECT: Users can read messages in their conversations
- ✅ INSERT: Users can send messages as themselves
- ❌ **MISSING:** UPDATE policy (users might want to edit their messages)
- ❌ **MISSING:** DELETE policy (users might want to delete their own messages)

### 6. **requests table**
- ✅ SELECT: All logged-in users can view requests
- ✅ INSERT: Users can create their own requests
- ✅ UPDATE: Users can update their own requests
- ✅ DELETE: Users can delete their own requests
- ❌ **MISSING:** Policies need explicit `user_id = auth.uid()` checks for UPDATE/DELETE

---

## 📋 Missing Database Features

### 1. **Indexes for Performance**
No indexes mentioned. Should add:
```sql
-- Listings indexes
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_book_id ON listings(book_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

-- Conversations indexes
CREATE INDEX idx_conversations_listing_id ON conversations(listing_id);
CREATE INDEX idx_conversations_request_id ON conversations(request_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Requests indexes
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- Listing images indexes
CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);
```

### 2. **Triggers for updated_at**
The schema mentions `updated_at` fields but no triggers to auto-update them:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. **RLS (Row Level Security)**
All tables show "Disable RLS" - this should be **ENABLED** for security. Policies won't work without RLS enabled.

---

## 🔍 Policy Implementation Details Needed

### Current Policy Issues:

1. **"Users can update their own listings"** - Needs explicit check:
   ```sql
   CREATE POLICY "Users can update their own listings"
   ON listings FOR UPDATE
   USING (user_id = auth.uid());
   ```

2. **"Users can delete their own listings"** - Needs explicit check:
   ```sql
   CREATE POLICY "Users can delete their own listings"
   ON listings FOR DELETE
   USING (user_id = auth.uid());
   ```

3. **"Users can add images to their own listings"** - Needs join check:
   ```sql
   CREATE POLICY "Users can add images to their own listings"
   ON listing_images FOR INSERT
   WITH CHECK (
     EXISTS (
       SELECT 1 FROM listings
       WHERE listings.id = listing_images.listing_id
       AND listings.user_id = auth.uid()
     )
   );
   ```

4. **"Users can delete images from their own listings"** - Needs join check:
   ```sql
   CREATE POLICY "Users can delete images from their own listings"
   ON listing_images FOR DELETE
   USING (
     EXISTS (
       SELECT 1 FROM listings
       WHERE listings.id = listing_images.listing_id
       AND listings.user_id = auth.uid()
     )
   );
   ```

5. **"Users can read conversations they are part of"** - Needs implementation:
   ```sql
   CREATE POLICY "Users can read conversations they are part of"
   ON conversations FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM messages
       WHERE messages.conversation_id = conversations.id
       AND messages.sender_id = auth.uid()
     )
   );
   ```
   **OR** if you track participants differently, you might need a `conversation_participants` table.

---

## 🚨 Missing Tables/Features

### 1. **conversation_participants table (RECOMMENDED)**
The current `conversations` table doesn't explicitly track who is in the conversation. Consider:
```sql
CREATE TABLE conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);
```

This makes the "Users can read conversations they are part of" policy much simpler:
```sql
CREATE POLICY "Users can read conversations they are part of"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);
```

### 2. **Profile Creation Trigger**
When a user signs up via Supabase Auth, you might want to auto-create a profile:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## ✅ What's Good

1. ✅ **Separation of concerns**: Books (metadata) vs Listings (actual items for sale/rent)
2. ✅ **Rental support**: Proper rental duration fields (value + unit)
3. ✅ **Request system**: Well-designed for users to request books
4. ✅ **Conversation constraint**: CHECK constraint ensures conversations are tied to either listing OR request
5. ✅ **Cascade deletes**: Proper ON DELETE CASCADE relationships

---

## 📝 Recommendations

### Immediate Actions:
1. **Enable RLS** on all tables
2. **Add explicit ownership checks** to all UPDATE/DELETE policies
3. **Standardize enum values** between code and schema
4. **Add indexes** for performance
5. **Add updated_at triggers**
6. **Consider conversation_participants table** for better conversation management

### Code Refactoring Needed:
1. Refactor backend to use `listings` table instead of `books` table for listings
2. Update models.py to match new schema enums
3. Implement rental listing support
4. Implement requests feature
5. Implement conversations/messages feature

---

## 🔐 Security Checklist

- [ ] RLS enabled on all tables
- [ ] All policies have explicit ownership checks (`user_id = auth.uid()`)
- [ ] Policies for listing_images verify ownership via join
- [ ] Policies for conversations verify participation
- [ ] No service role key exposed to frontend
- [ ] Email verification required (already implemented)

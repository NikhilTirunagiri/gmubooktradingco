# Schema Documentation

This folder contains schema analysis and setup files for the GMU Book Trading Co database.

## Files

- **SCHEMA_ANALYSIS.md** - Detailed analysis of the database schema and policies
- **SCHEMA_REVIEW_SUMMARY.md** - Quick summary of issues and action items
- **SUPABASE_SETUP_COMPLETE.sql** - Complete SQL setup script (use for new installations)
- **SUPABASE_MIGRATION_FIX.sql** - Migration script to fix existing setups (already run)

## Status

✅ All migration fixes have been applied to the database.
✅ Backend code has been updated to match the new schema.

## Current Schema

- `profiles` - User profiles (linked to auth.users)
- `books` - Book metadata only (title, author, isbn)
- `listings` - Actual listings for sale/rent
- `listing_images` - Images for listings
- `requests` - User requests for books
- `conversations` - Messaging conversations
- `messages` - Individual messages
- `conversation_participants` - Participants in conversations

## Notes

These files are kept for reference. The database has already been migrated using `SUPABASE_MIGRATION_FIX.sql`.

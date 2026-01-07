"""
Supabase client configuration
"""
import httpx
from supabase import create_client, Client
from supabase.client import ClientOptions
from app.config import settings

# Configure HTTP client with timeout to prevent hanging
http_client = httpx.Client(
    timeout=httpx.Timeout(30.0, connect=10.0),  # 30s total, 10s to connect
    limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
)

# Create Supabase client for user operations (uses anon key)
# Note: Supabase Python client doesn't directly support httpx timeout,
# but we can configure it through the underlying httpx client
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_ANON_KEY,
    options=ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
    )
)

# Create Supabase admin client for server-side operations (uses service role key)
admin_options = ClientOptions(
    auto_refresh_token=False,
    persist_session=False,
)

supabase_admin: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
    options=admin_options,
)

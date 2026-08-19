# Supabase Authentication Integration for Khati Family

## Overview
This project now includes Supabase authentication with support for:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Password reset functionality
- ✅ User profiles stored in Supabase
- ✅ Row Level Security (RLS) policies

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Note down your project URL and anon key from the API settings

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Run Database Migrations
1. Go to your Supabase Dashboard > SQL Editor
2. Open `supabase/migrations/001_initial_auth_setup.sql`
3. Copy and paste the entire content into the SQL Editor
4. Click "Run" to execute the migration
5. This will create:
   - `profiles` table for user data
   - `customers` table for billing/shipping info
   - `orders` table for order history
   - Triggers for automatic profile creation
   - Row Level Security policies

### 4. Configure OAuth Providers

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URI:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
6. Copy Client ID and Client Secret
7. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Add OAuth Redirect URI:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. Copy App ID and App Secret
6. In Supabase Dashboard > Authentication > Providers > Facebook:
   - Enable Facebook provider
   - Paste App ID as Client ID
   - Paste App Secret as Client Secret
   - Save

### 5. Configure Redirect URLs
In Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `http://localhost:3000` (for development)
- Add Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-production-domain.com/auth/callback` (when deploying)

### 6. Test Authentication
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to `/signin` or `/signup`
3. Test each authentication method:
   - Email/password signup
   - Email/password signin
   - Google OAuth
   - Facebook OAuth
   - Password reset flow

## Features

### Authentication Context
The `AuthContext` provides the following methods:
- `signUp(email, password, metadata)` - Create new account with email/password
- `signIn(email, password)` - Sign in with email/password
- `signInWithGoogle()` - Sign in with Google OAuth
- `signInWithFacebook()` - Sign in with Facebook OAuth
- `signOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email

### User Profile
User profile data is automatically created on signup and includes:
- `id` - User UUID (matches auth.users.id)
- `email` - User email
- `first_name` - First name
- `last_name` - Last name
- `phone` - Phone number
- `newsletter_subscribed` - Newsletter preference
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure session management with refresh tokens
- OAuth providers use secure redirect flows

## Database Schema

### profiles
```sql
id UUID PRIMARY KEY (references auth.users)
email TEXT UNIQUE NOT NULL
first_name TEXT
last_name TEXT
phone TEXT
avatar_url TEXT
newsletter_subscribed BOOLEAN DEFAULT false
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
```

### customers
```sql
id UUID PRIMARY KEY
user_id UUID (references auth.users)
stripe_customer_id TEXT UNIQUE
billing_address JSONB
shipping_address JSONB
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
```

### orders
```sql
id UUID PRIMARY KEY
user_id UUID (references auth.users)
customer_email TEXT NOT NULL
order_number TEXT UNIQUE NOT NULL
status TEXT DEFAULT 'pending'
total_amount DECIMAL(10, 2) NOT NULL
currency TEXT DEFAULT 'BDT'
shipping_address JSONB
billing_address JSONB
items JSONB NOT NULL
payment_method TEXT
payment_status TEXT DEFAULT 'pending'
notes TEXT
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
```

## File Structure

### New Files Added
```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context provider
├── lib/
│   └── supabase/
│       ├── client.ts            # Client-side Supabase client
│       └── server.ts            # Server-side Supabase client
├── app/
│   └── auth/
│       ├── callback/
│       │   └── route.ts         # OAuth callback handler
│       └── reset-password/
│           └── page.tsx         # Password reset page
supabase/
└── migrations/
    ├── 001_initial_auth_setup.sql
    └── 002_oauth_setup_instructions.sql
.env.example                      # Environment variables template
```

### Modified Files
```
src/app/layout.tsx               # Added AuthProvider wrapper
src/app/(store)/signin/page.tsx  # Integrated Supabase auth
src/app/(store)/signup/page.tsx  # Integrated Supabase auth
```

## Usage in Components

### Get Current User
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

### Sign Out
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      // Redirect or show success message
    }
  };
  
  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Production Deployment

Before deploying to production:
1. Update `NEXT_PUBLIC_SITE_URL` in `.env.local`
2. Add production redirect URLs in Supabase Dashboard
3. Update OAuth provider settings with production URLs
4. Enable email confirmations in Supabase Dashboard
5. Configure custom email templates
6. Set up rate limiting
7. Review and test all RLS policies

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Repository: [Your repo URL]

## Security Notes

⚠️ **Important Security Reminders:**
- Never commit `.env.local` to version control
- Keep your service role key secret
- Use HTTPS in production
- Regularly rotate OAuth credentials
- Enable MFA for admin accounts
- Review audit logs regularly
- Keep dependencies updated

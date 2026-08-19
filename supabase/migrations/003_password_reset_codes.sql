-- =====================================================
-- Password Reset Codes Table
-- =====================================================
-- Custom password reset system using verification codes
-- instead of Supabase's default reset links
-- =====================================================

-- Create password_reset_codes table
CREATE TABLE IF NOT EXISTS public.password_reset_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.password_reset_codes ENABLE ROW LEVEL SECURITY;

-- Create policy - no direct access from client
-- Only server-side API routes can access this table
CREATE POLICY "Service role only access"
  ON public.password_reset_codes
  FOR ALL
  USING (false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS password_reset_codes_email_idx ON public.password_reset_codes(email);
CREATE INDEX IF NOT EXISTS password_reset_codes_code_idx ON public.password_reset_codes(code);
CREATE INDEX IF NOT EXISTS password_reset_codes_expires_at_idx ON public.password_reset_codes(expires_at);

-- Function to clean up expired codes (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.password_reset_codes
  WHERE expires_at < timezone('utc'::text, now())
    OR (used = true AND created_at < timezone('utc'::text, now()) - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON public.password_reset_codes TO postgres, service_role;

-- Comments
COMMENT ON TABLE public.password_reset_codes IS 'Stores verification codes for password reset (code-based, no reset links)';
COMMENT ON COLUMN public.password_reset_codes.code IS '6-digit verification code sent via SMTP email';
COMMENT ON COLUMN public.password_reset_codes.expires_at IS 'Code expires after 15 minutes';
COMMENT ON FUNCTION public.cleanup_expired_reset_codes() IS 'Cleanup function to remove expired and used codes';

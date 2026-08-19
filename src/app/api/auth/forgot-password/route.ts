import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateResetCode, sendEmail, getPasswordResetEmailTemplate } from '@/lib/email';

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists in auth.users
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      );
    }

    const userExists = users.users.some(user => user.email === email);

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (userExists) {
      // Generate 6-digit code
      const code = generateResetCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

      // Store code in database
      const { error: insertError } = await supabaseAdmin
        .from('password_reset_codes')
        .insert({
          email: email.toLowerCase(),
          code,
          expires_at: expiresAt.toISOString(),
          used: false,
        });

      if (insertError) {
        console.error('Error storing reset code:', insertError);
        return NextResponse.json(
          { error: 'Failed to generate reset code' },
          { status: 500 }
        );
      }

      // Send email with code
      const emailResult = await sendEmail({
        to: email,
        subject: 'Password Reset Code - Khati Family',
        html: getPasswordResetEmailTemplate(code),
      });

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
        return NextResponse.json(
          { error: 'Failed to send reset code email' },
          { status: 500 }
        );
      }

      console.log(`Password reset code sent to ${email}`);
    } else {
      console.log(`Password reset requested for non-existent email: ${email}`);
      // Still return success to prevent email enumeration
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset code has been sent.',
    });

  } catch (error) {
    console.error('Error in forgot-password API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: 'Please provide all required fields: name, email, password, phone.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: 'Supabase admin client is not initialized. Please verify SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    // 1. Create the user as pre-confirmed using the Admin Client
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: { name, phone }
    });

    if (createError) {
      return NextResponse.json(
        { message: createError.message || 'Error creating user in Supabase.' },
        { status: 400 }
      );
    }

    const newUser = userData.user;

    // Determine role (for admin@hommed.com it is 'admin', else 'patient')
    const role = email.toLowerCase() === 'admin@hommed.com' ? 'admin' : 'patient';

    // 2. Insert profile record programmatically (in case the Postgres trigger is not active)
    try {
      await supabaseAdmin.from('profiles').upsert({
        id: newUser.id,
        name,
        phone,
        role
      });
    } catch (profileErr) {
      console.warn("Postgres trigger fallback failed: ", profileErr);
    }

    // 3. Sign in to obtain the access token session
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (signInError || !sessionData.session) {
      return NextResponse.json(
        { message: signInError?.message || 'Error logging in after registration.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Registration successful!',
      token: sessionData.session.access_token,
      user: {
        id: newUser.id,
        name,
        email: newUser.email,
        phone,
        role
      }
    }, { status: 201 });

  } catch (err: any) {
    console.error("Signup error: ", err);
    return NextResponse.json(
      { message: err.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}

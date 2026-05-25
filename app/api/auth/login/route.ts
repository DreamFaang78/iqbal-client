import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    // Sign in using Supabase Auth
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (signInError || !sessionData.session) {
      return NextResponse.json(
        { message: signInError?.message || 'Invalid credentials. Please check your email or password.' },
        { status: 400 }
      );
    }

    const user = sessionData.user;
    const db = supabaseAdmin || supabase;

    // Fetch user profile info
    let { data: profile } = await db
      .from('profiles')
      .select('name, phone, role')
      .eq('id', user.id)
      .maybeSingle();

    const name = profile?.name || user.user_metadata?.name || 'User';
    const phone = profile?.phone || user.user_metadata?.phone || '';
    
    // Explicitly check role from profile or check email fallback
    let role = 'patient';
    if (profile?.role) {
      role = profile.role;
    } else if (email.toLowerCase() === 'admin@hommed.com') {
      role = 'admin';
    } else if (email.toLowerCase().includes('staff')) {
      role = 'staff';
    }

    // Self-healing fallback: insert profile in database if missing
    if (!profile && supabaseAdmin) {
      try {
        await supabaseAdmin.from('profiles').insert({
          id: user.id,
          name,
          phone,
          role
        });
      } catch (upsertError) {
        console.warn("Failed to self-heal user profile: ", upsertError);
      }
    }

    return NextResponse.json({
      message: 'Login successful!',
      token: sessionData.session.access_token,
      user: {
        id: user.id,
        name,
        email: user.email,
        phone,
        role
      }
    }, { status: 200 });

  } catch (err: any) {
    console.error("Login error: ", err);
    return NextResponse.json(
      { message: err.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}

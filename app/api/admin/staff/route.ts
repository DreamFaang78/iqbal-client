import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

// Helper to verify JWT token and check if user is admin.
// Mirrors the verifyAdminToken pattern in app/api/leads/route.ts.
async function verifyAdminToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    // Query profiles for role
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin' || user.email?.toLowerCase() === 'admin@hommed.com';
  } catch (err) {
    return false;
  }
}

// GET: List all clinic staff accounts (Admin Only).
// Reads profiles where role = 'staff'; emails are resolved from auth.users via
// the service-role admin API (profiles holds no email column).
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { data: profiles, error } = await db
      .from('profiles')
      .select('id, name, phone, role, created_at')
      .eq('role', 'staff')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Resolve emails (stored on auth.users, not profiles) using the admin API.
    const emailById = new Map<string, string>();
    if (supabaseAdmin) {
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        for (const u of usersData?.users || []) {
          if (u.email) emailById.set(u.id, u.email);
        }
      } catch (e) {
        console.warn('Could not resolve staff emails from auth.users: ', e);
      }
    }

    // Map database fields to a clean shape for the UI.
    const mapped = (profiles || []).map(p => ({
      id: p.id,
      name: p.name,
      email: emailById.get(p.id) || null,
      phone: p.phone,
      role: p.role,
      status: 'Active',
      createdAt: p.created_at
    }));

    return NextResponse.json(mapped, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

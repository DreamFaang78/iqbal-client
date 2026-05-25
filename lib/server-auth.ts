import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * Shared server-side helper to verify JWT tokens and RBAC
 * Enforces presentation layer -> business logic separation
 */
export async function verifyStaffToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    // Fetch user role from public profiles
    const db = supabaseAdmin || supabase;
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || (user.email?.toLowerCase() === 'admin@hommed.com' ? 'admin' : 'patient');

    // Only staff and admins authorized
    if (role !== 'staff' && role !== 'admin') {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role
    };
  } catch (err) {
    return null;
  }
}

import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

/**
 * GET /api/appointments/availability?date=YYYY-MM-DD
 *
 * Public, read-only endpoint that returns the list of already-taken time slots
 * for a given date so the booking form can disable them. It exposes only the
 * `schedule_time` values of active (Pending/Confirmed) appointments — no patient
 * details — so it is safe to call without authentication.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ message: 'A date is required.' }, { status: 400 });
    }

    const { data, error } = await db
      .from('appointments')
      .select('schedule_time')
      .eq('schedule_date', date)
      .in('status', ['Pending', 'Confirmed']);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const bookedSlots = (data || [])
      .map((row) => row.schedule_time)
      .filter((t): t is string => Boolean(t));

    return NextResponse.json({ date, bookedSlots }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Could not load availability.' },
      { status: 500 }
    );
  }
}

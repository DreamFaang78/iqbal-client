import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyStaffToken } from '@/lib/server-auth';

export async function GET(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ message: 'Patient ID required' }, { status: 400 });
    }

    const db = supabaseAdmin || supabase;
    const { data: events, error } = await db
      .from('patient_timeline')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // No records → honest empty array, never sample data.
    return NextResponse.json(events ?? [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to load timeline' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await request.json();

    if (!payload?.patient_id || !payload?.event_type) {
      return NextResponse.json(
        { message: 'Patient ID and event type are required' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;
    const { data, error } = await db
      .from('patient_timeline')
      .insert({
        patient_id: payload.patient_id,
        event_type: payload.event_type, // 'visit', 'prescription', 'note', 'call', 'followup'
        title: payload.title,
        description: payload.description
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}

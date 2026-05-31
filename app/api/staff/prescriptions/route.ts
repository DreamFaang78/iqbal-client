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
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    const db = supabaseAdmin || supabase;
    const { data: prescriptions, error } = await db
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('issued_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // No records → honest empty array, never sample data.
    return NextResponse.json(prescriptions ?? [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to load prescriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await request.json();

    if (!payload?.patient_id) {
      return NextResponse.json(
        { message: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;
    const { data, error } = await db
      .from('prescriptions')
      .insert({
        patient_id: payload.patient_id,
        appointment_id: payload.appointment_id || null,
        diagnosis: payload.diagnosis,
        chief_complaint: payload.chief_complaint,
        medicines: payload.medicines, // Expected JSON structure
        dietary_advice: payload.dietary_advice,
        follow_up_date: payload.follow_up_date || null,
        remarks: payload.remarks
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to save prescription' },
      { status: 500 }
    );
  }
}

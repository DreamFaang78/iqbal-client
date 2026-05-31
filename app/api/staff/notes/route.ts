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
    const { data: notes, error } = await db
      .from('patient_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // No records → honest empty array, never sample data.
    return NextResponse.json(notes ?? [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to load notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await request.json();

    if (!payload?.patient_id || !payload?.note) {
      return NextResponse.json(
        { message: 'Patient ID and note are required' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;
    const { data, error } = await db
      .from('patient_notes')
      .insert({
        patient_id: payload.patient_id,
        note: payload.note
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to save note' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const db = supabaseAdmin || supabase;
    const { error } = await db
      .from('patient_notes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Deletion failed' },
      { status: 500 }
    );
  }
}

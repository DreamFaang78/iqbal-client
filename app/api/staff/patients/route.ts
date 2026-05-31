import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyStaffToken } from '@/lib/server-auth';

export async function GET(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = supabaseAdmin || supabase;
    const { data: patients, error } = await db
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // No records → honest empty array, never sample data.
    return NextResponse.json(patients ?? [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to load patient records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await request.json();

    if (!payload?.name || !payload?.phone) {
      return NextResponse.json(
        { message: 'Patient name and phone are required' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('patients')
      .insert({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        age: parseInt(payload.age) || null,
        gender: payload.gender,
        address: payload.address,
        blood_group: payload.blood_group,
        known_allergies: payload.known_allergies,
        chronic_conditions: payload.chronic_conditions,
        emergency_contact: payload.emergency_contact,
        notes: payload.notes
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Failed to create patient record' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await verifyStaffToken(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await request.json();
    const { id, ...updateData } = payload;

    if (!id) {
      return NextResponse.json(
        { message: 'Patient id is required' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;

    const { data, error } = await db
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Update failed' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

// Helper to verify JWT token and check if user is admin
async function verifyAdminToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

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

function mapPopup(p: any) {
  return {
    _id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    isActive: p.is_active,
    delaySeconds: p.delay_seconds
  };
}

// GET: Retrieve all popup configurations
export async function GET(request: Request) {
  try {
    const { data: popups, error } = await db
      .from('popups')
      .select('*')
      .order('type', { ascending: true });

    if (error || !popups || popups.length === 0) {
      // Fallback mock structures if DB is empty
      const mockPopups = [
        { type: 'appointment', title: 'Need Homeopathy Consultation?', content: 'Book your digital wellness consult today and get 10% off your first medicine dispatch.', isActive: true, delaySeconds: 5 },
        { type: 'whatsapp', title: 'Consult Dr. Iqbal on WhatsApp', content: 'Get instant answers for your healthcare inquiries directly from the doctor.', isActive: true, delaySeconds: 3 },
        { type: 'exit', title: 'Wait! Don\'t Leave Empty-Handed', content: 'Drop your details below to download Dr. Iqbal\'s "Natural Homeopathy Health Guide" for free.', isActive: false, delaySeconds: 0 },
        { type: 'offer', title: 'Special Monsoon Wellness Offer', content: 'Free thyroid screen with every chronic allergy packages.', isActive: false, delaySeconds: 10 }
      ];
      return NextResponse.json(mockPopups, { status: 200 });
    }

    return NextResponse.json(popups.map(mapPopup), { status: 200 });
  } catch (err: any) {
    // If DB fails, return fallback mock structures
    const mockPopups = [
      { type: 'appointment', title: 'Need Homeopathy Consultation?', content: 'Book your digital wellness consult today and get 10% off your first medicine dispatch.', isActive: true, delaySeconds: 5 },
      { type: 'whatsapp', title: 'Consult Dr. Iqbal on WhatsApp', content: 'Get instant answers for your healthcare inquiries directly from the doctor.', isActive: true, delaySeconds: 3 },
      { type: 'exit', title: 'Wait! Don\'t Leave Empty-Handed', content: 'Drop your details below to download Dr. Iqbal\'s "Natural Homeopathy Health Guide" for free.', isActive: false, delaySeconds: 0 },
      { type: 'offer', title: 'Special Monsoon Wellness Offer', content: 'Free thyroid screen with every chronic allergy packages.', isActive: false, delaySeconds: 10 }
    ];
    return NextResponse.json(mockPopups, { status: 200 });
  }
}

// PUT: Update a popup's active status (Admin Only)
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { id, isActive, delaySeconds } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Popup ID required' }, { status: 400 });
    }

    // If making this popup active, deactivate all other popups
    if (isActive) {
      const { error: deactivateError } = await db
        .from('popups')
        .update({ is_active: false })
        .neq('id', id);

      if (deactivateError) {
        throw deactivateError;
      }
    }

    const { data: updated, error } = await db
      .from('popups')
      .update({
        ...(isActive !== undefined && { is_active: isActive }),
        ...(delaySeconds !== undefined && { delay_seconds: delaySeconds })
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ message: 'Popup not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Popup updated successfully.',
      popup: mapPopup(updated)
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}


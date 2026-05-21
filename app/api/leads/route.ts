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

// GET: List all leads (Admin Only)
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { data: leads, error } = await db
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database fields to the frontend camelCase structure
    const mapped = (leads || []).map(l => ({
      _id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email,
      inquiry: l.inquiry,
      status: l.status,
      followUpDate: l.follow_up_date,
      createdAt: l.created_at
    }));

    return NextResponse.json(mapped, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// POST: Add a new lead (Publicly Accessible)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, inquiry } = body;

    if (!name || !phone || !inquiry) {
      return NextResponse.json(
        { message: 'Missing name, phone, or inquiry fields.' },
        { status: 400 }
      );
    }

    const { data: lead, error } = await db
      .from('leads')
      .insert({
        name,
        phone,
        email: email || null,
        inquiry,
        status: 'New Lead'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send Telegram Alert
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      await sendTelegramNotification(
        `📬 *New CRM Lead Generated*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📧 *Email:* ${email || 'N/A'}\n` +
        `📝 *Inquiry:* ${inquiry}`
      );
    } catch (e) {
      console.warn("Telegram lead notification failed: ", e);
    }

    const mappedLead = {
      _id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      inquiry: lead.inquiry,
      status: lead.status,
      followUpDate: lead.follow_up_date,
      createdAt: lead.created_at
    };

    return NextResponse.json({
      message: 'Inquiry submitted successfully!',
      lead: mappedLead
    }, { status: 201 });

  } catch (err: any) {
    console.error("Lead creation failed: ", err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Modify lead status or details (Admin Only)
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { id, status, followUpDate } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Lead ID required' }, { status: 400 });
    }

    const { data: updatedLead, error } = await db
      .from('leads')
      .update({
        ...(status && { status }),
        ...(followUpDate && { follow_up_date: followUpDate })
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedLead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    const mappedLead = {
      _id: updatedLead.id,
      name: updatedLead.name,
      phone: updatedLead.phone,
      email: updatedLead.email,
      inquiry: updatedLead.inquiry,
      status: updatedLead.status,
      followUpDate: updatedLead.follow_up_date,
      createdAt: updatedLead.created_at
    };

    return NextResponse.json({
      message: 'Lead updated successfully.',
      lead: mappedLead
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

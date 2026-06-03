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
      followUpScheduled: l.follow_up_scheduled,
      leadSource: l.lead_source,
      notes: l.notes,
      isDuplicate: l.is_duplicate,
      assignedTo: l.assigned_to,
      age: l.age,
      gender: l.gender,
      city: l.city,
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
    const { name, phone, email, inquiry, leadSource, lead_source, age, gender, city, notes } = body;

    if (!name || !phone || !inquiry) {
      return NextResponse.json(
        { message: 'Missing name, phone, or inquiry fields.' },
        { status: 400 }
      );
    }

    // Check for duplicate phone number in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let isDuplicate = false;
    try {
      const { data: duplicateLead } = await db
        .from('leads')
        .select('id')
        .eq('phone', phone)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .limit(1)
        .maybeSingle();

      isDuplicate = !!duplicateLead;
    } catch (dupErr) {
      console.warn("Duplicate check warning: ", dupErr);
    }

    const source = leadSource || lead_source || 'contact';

    const { data: lead, error } = await db
      .from('leads')
      .insert({
        name,
        phone,
        email: email || null,
        inquiry,
        status: 'New Lead',
        lead_source: source,
        is_duplicate: isDuplicate,
        age: age || null,
        gender: gender || null,
        city: city || null,
        notes: notes || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send Telegram Alert
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      const duplicateLabel = isDuplicate ? '⚠️ *DUPLICATE LEAD DETECTION*' : '';
      await sendTelegramNotification(
        `📬 *New CRM Lead Generated* ${duplicateLabel}\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📧 *Email:* ${email || 'N/A'}\n` +
        `🌐 *Source:* ${source}\n` +
        `📍 *City:* ${city || 'N/A'}\n` +
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
      followUpScheduled: lead.follow_up_scheduled,
      leadSource: lead.lead_source,
      notes: lead.notes,
      isDuplicate: lead.is_duplicate,
      assignedTo: lead.assigned_to,
      age: lead.age,
      gender: lead.gender,
      city: lead.city,
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

    const body = await request.json();
    const { id, status, followUpDate, followUpScheduled, notes, leadSource, assignedTo, age, gender, city } = body;

    if (!id) {
      return NextResponse.json({ message: 'Lead ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (followUpDate !== undefined) updateData.follow_up_date = followUpDate;
    if (followUpScheduled !== undefined) updateData.follow_up_scheduled = followUpScheduled;
    if (notes !== undefined) updateData.notes = notes;
    if (leadSource !== undefined) updateData.lead_source = leadSource;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (city !== undefined) updateData.city = city;

    const { data: updatedLead, error } = await db
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedLead) {
      console.error("PUT /api/leads database update error:", error, "updatedLead:", updatedLead);
      return NextResponse.json({ message: 'Lead not found or update failed', error: error?.message }, { status: 404 });
    }

    const mappedLead = {
      _id: updatedLead.id,
      name: updatedLead.name,
      phone: updatedLead.phone,
      email: updatedLead.email,
      inquiry: updatedLead.inquiry,
      status: updatedLead.status,
      followUpDate: updatedLead.follow_up_date,
      followUpScheduled: updatedLead.follow_up_scheduled,
      leadSource: updatedLead.lead_source,
      notes: updatedLead.notes,
      isDuplicate: updatedLead.is_duplicate,
      assignedTo: updatedLead.assigned_to,
      age: updatedLead.age,
      gender: updatedLead.gender,
      city: updatedLead.city,
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

// DELETE: Remove a lead (Admin Only)
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Lead ID required' }, { status: 400 });
    }

    const { error } = await db
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Lead deleted successfully.' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

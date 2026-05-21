import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin || supabase;

// Helper to verify JWT token using Supabase Auth
async function verifyToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    // Fetch user role from public profiles
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return {
      userId: user.id,
      email: user.email,
      role: profile?.role || (user.email?.toLowerCase() === 'admin@hommed.com' ? 'admin' : 'patient')
    };
  } catch (err) {
    return null;
  }
}

// GET: Retrieve appointments
// Users get their own; Admins get all
export async function GET(request: Request) {
  try {
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized. Please login.' }, { status: 401 });
    }

    let query = db.from('appointments').select('*');

    if (decoded.role !== 'admin') {
      query = query.eq('user_id', decoded.userId);
    }

    const { data: appointments, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database fields to the frontend camelCase structure
    const mapped = (appointments || []).map(a => ({
      _id: a.id,
      patientId: a.user_id,
      patientName: a.patient_name,
      patientPhone: a.patient_phone,
      doctorName: a.doctor_name,
      service: a.service,
      scheduleDate: a.schedule_date,
      scheduleTime: a.schedule_time,
      status: a.status,
      paymentStatus: a.payment_status,
      createdAt: a.created_at
    }));

    return NextResponse.json(mapped, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// POST: Create a new appointment
export async function POST(request: Request) {
  try {
    const decoded = await verifyToken(request);
    const body = await request.json();
    const { patientName, patientPhone, service, scheduleDate, scheduleTime } = body;

    if (!patientName || !patientPhone || !service || !scheduleDate || !scheduleTime) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const patientId = decoded?.userId || null;

    // Check for double booking conflict in the same slot on the same date
    const { data: conflict } = await db
      .from('appointments')
      .select('id')
      .eq('schedule_date', scheduleDate)
      .eq('schedule_time', scheduleTime)
      .in('status', ['Pending', 'Confirmed'])
      .maybeSingle();

    if (conflict) {
      return NextResponse.json(
        { message: 'This slot is already booked. Please choose a different timing or date.' },
        { status: 400 }
      );
    }

    // Create the Appointment record
    const { data: appointment, error: insertError } = await db
      .from('appointments')
      .insert({
        user_id: patientId,
        patient_name: patientName,
        patient_phone: patientPhone,
        service,
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
        status: 'Pending',
        payment_status: 'Pending'
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Also auto-log a Lead in the CRM for tracking
    await db
      .from('leads')
      .insert({
        name: patientName,
        phone: patientPhone,
        inquiry: `Auto-generated Lead from appointment booking request for: ${service} on ${scheduleDate} @ ${scheduleTime}`,
        status: 'New Lead'
      });

    // Trigger Telegram Notification
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      await sendTelegramNotification(
        `🚨 *New Appointment Request*\n\n` +
        `👤 *Patient:* ${patientName}\n` +
        `📞 *Phone:* ${patientPhone}\n` +
        `💼 *Service:* ${service}\n` +
        `📅 *Date:* ${scheduleDate}\n` +
        `⏰ *Time:* ${scheduleTime}\n\n` +
        `Please review this booking on your HOMMED Admin CRM dashboard.`
      );
    } catch (e) {
      console.warn("Telegram notification alert failed: ", e);
    }

    const mappedAppointment = {
      _id: appointment.id,
      patientId: appointment.user_id,
      patientName: appointment.patient_name,
      patientPhone: appointment.patient_phone,
      doctorName: appointment.doctor_name,
      service: appointment.service,
      scheduleDate: appointment.schedule_date,
      scheduleTime: appointment.schedule_time,
      status: appointment.status,
      paymentStatus: appointment.payment_status,
      createdAt: appointment.created_at
    };

    return NextResponse.json({
      message: 'Appointment requested successfully.',
      appointment: mappedAppointment
    }, { status: 201 });

  } catch (err: any) {
    console.error("Booking error: ", err);
    return NextResponse.json(
      { message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT: Admin updates status / schedule details
export async function PUT(request: Request) {
  try {
    const decoded = await verifyToken(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id, status, paymentStatus, scheduleDate, scheduleTime } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Appointment ID required' }, { status: 400 });
    }

    const { data: updated, error: updateError } = await db
      .from('appointments')
      .update({
        ...(status && { status }),
        ...(paymentStatus && { payment_status: paymentStatus }),
        ...(scheduleDate && { schedule_date: scheduleDate }),
        ...(scheduleTime && { schedule_time: scheduleTime })
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    const mappedAppointment = {
      _id: updated.id,
      patientId: updated.user_id,
      patientName: updated.patient_name,
      patientPhone: updated.patient_phone,
      doctorName: updated.doctor_name,
      service: updated.service,
      scheduleDate: updated.schedule_date,
      scheduleTime: updated.schedule_time,
      status: updated.status,
      paymentStatus: updated.payment_status,
      createdAt: updated.created_at
    };

    return NextResponse.json({
      message: 'Appointment details updated successfully.',
      appointment: mappedAppointment
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

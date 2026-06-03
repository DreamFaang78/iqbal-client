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
      appointmentType: a.appointment_type,
      patientEmail: a.patient_email,
      patientAge: a.patient_age,
      patientGender: a.patient_gender,
      patientCity: a.patient_city,
      disease: a.disease,
      notes: a.notes,
      createdAt: a.created_at,
      updatedAt: a.updated_at
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
    const { 
      patientName, 
      patientPhone, 
      service, 
      scheduleDate, 
      scheduleTime,
      appointmentType,
      patientEmail,
      patientAge,
      patientGender,
      patientCity,
      disease,
      notes
    } = body;

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

    const type = appointmentType || 'Clinic 1';

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
        payment_status: 'Pending',
        appointment_type: type,
        patient_email: patientEmail || null,
        patient_age: patientAge ? parseInt(patientAge.toString()) : null,
        patient_gender: patientGender || null,
        patient_city: patientCity || null,
        disease: disease || null,
        notes: notes || null
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Also auto-log a Lead in the CRM for tracking (best-effort, must never
    // turn an otherwise-successful booking into a 500)
    try {
      const { error: leadError } = await db
        .from('leads')
        .insert({
          name: patientName,
          phone: patientPhone,
          email: patientEmail || null,
          inquiry: `Auto-generated Lead from appointment booking request. Problem: ${disease || service}. Requested: ${type} on ${scheduleDate} @ ${scheduleTime}`,
          status: 'New Lead',
          lead_source: 'booking',
          age: patientAge ? parseInt(patientAge.toString()) : null,
          gender: patientGender || null,
          city: patientCity || null
        });
      if (leadError) {
        console.warn("Auto-lead creation from booking failed: ", leadError.message);
      }
    } catch (e) {
      console.warn("Auto-lead creation from booking threw: ", e);
    }

    // Trigger Telegram Notification
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      await sendTelegramNotification(
        `🚨 *New Appointment Request*\n\n` +
        `👤 *Patient:* ${patientName}\n` +
        `📞 *Phone:* ${patientPhone}\n` +
        `📧 *Email:* ${patientEmail || 'N/A'}\n` +
        `💼 *Service:* ${service}\n` +
        `🌐 *Type:* ${type}\n` +
        `📅 *Date:* ${scheduleDate}\n` +
        `⏰ *Time:* ${scheduleTime}\n` +
        `📍 *City:* ${patientCity || 'N/A'}\n` +
        `🩺 *Disease/Inquiry:* ${disease || 'N/A'}\n\n` +
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
      appointmentType: appointment.appointment_type,
      patientEmail: appointment.patient_email,
      patientAge: appointment.patient_age,
      patientGender: appointment.patient_gender,
      patientCity: appointment.patient_city,
      disease: appointment.disease,
      notes: appointment.notes,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at
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

    const body = await request.json();
    const { 
      id, 
      status, 
      paymentStatus, 
      scheduleDate, 
      scheduleTime,
      appointmentType,
      patientEmail,
      patientAge,
      patientGender,
      patientCity,
      disease,
      notes
    } = body;

    if (!id) {
      return NextResponse.json({ message: 'Appointment ID required' }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.payment_status = paymentStatus;
    if (scheduleDate !== undefined) updateData.schedule_date = scheduleDate;
    if (scheduleTime !== undefined) updateData.schedule_time = scheduleTime;
    if (appointmentType !== undefined) updateData.appointment_type = appointmentType;
    if (patientEmail !== undefined) updateData.patient_email = patientEmail;
    if (patientAge !== undefined) updateData.patient_age = patientAge ? parseInt(patientAge.toString()) : null;
    if (patientGender !== undefined) updateData.patient_gender = patientGender;
    if (patientCity !== undefined) updateData.patient_city = patientCity;
    if (disease !== undefined) updateData.disease = disease;
    if (notes !== undefined) updateData.notes = notes;

    const { data: updated, error: updateError } = await db
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ message: 'Appointment not found or update failed' }, { status: 404 });
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
      appointmentType: updated.appointment_type,
      patientEmail: updated.patient_email,
      patientAge: updated.patient_age,
      patientGender: updated.patient_gender,
      patientCity: updated.patient_city,
      disease: updated.disease,
      notes: updated.notes,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };

    return NextResponse.json({
      message: 'Appointment details updated successfully.',
      appointment: mappedAppointment
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

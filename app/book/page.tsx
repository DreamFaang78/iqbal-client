'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEFAULT_SERVICES } from '@/lib/data';

function BookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [user, setUser] = useState<{ id: string; name: string; email: string; phone: string } | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    service: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Time Slots definition
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
    '05:00 PM', '06:00 PM', '07:00 PM', '07:30 PM'
  ];

  // Min date selector: today
  const [minDate, setMinDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('hommed_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData(prev => ({
        ...prev,
        patientName: parsed.name,
        patientPhone: parsed.phone,
        service: initialService
      }));
    } else {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectTimeSlot = (slot: string) => {
    setFormData({ ...formData, scheduleTime: slot });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone || !formData.service || !formData.scheduleDate || !formData.scheduleTime) {
      setError('Please fill in all scheduling fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking failed.');
      }

      // Celebrates booking success
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Could not register booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] bg-grid py-16 px-4 font-sans relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-cyan/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {success ? (
          <div className="glass-dark rounded-[36px] p-10 text-center space-y-6">
            <div className="p-4 bg-emerald-500/10 text-brand-green border border-brand-green/20 rounded-full w-fit mx-auto animate-bounce">
              <CheckCircle2 className="h-14 w-14" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-3xl text-white">Appointment Requested!</h2>
              <p className="text-slate-300 text-base font-light max-w-md mx-auto">
                Your consultation request has been received. Our clinic coordinator will contact you shortly via phone or WhatsApp to finalize your slot.
              </p>
            </div>

            <div className="p-6 bg-[#162847]/40 border border-white/10 rounded-3xl max-w-sm mx-auto text-left space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-white">{formData.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Specialization:</span>
                <span className="font-bold text-white">{formData.service}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-white">{formData.scheduleDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Preferred Slot:</span>
                <span className="font-bold text-brand-cyan">{formData.scheduleTime}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={() => router.push(user ? (user as any).role === 'admin' ? '/admin' : '/dashboard' : '/dashboard')}
                className="px-6 h-12 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 h-12 border border-white/15 hover:bg-white/10 text-white rounded-xl font-semibold transition-all cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-dark rounded-[32px] p-8 sm:p-10 space-y-8">
            <div className="space-y-2 text-center">
              <span className="text-brand-cyan font-accent text-sm font-semibold uppercase tracking-wider">Appointment Form</span>
              <h1 className="font-heading font-extrabold text-3xl text-white leading-tight">
                Schedule a Consultation
              </h1>
              <p className="text-slate-300 text-sm font-light">
                Secure your slot with Dr. Iqbal. Please verify patient info before submitting.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{error}</span>
              </div>
            )}

            {!user && (
              <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-2xl text-xs text-brand-cyan flex items-center justify-between">
                <span>Already have a Patient Account? Log in to sync details instantly.</span>
                <button
                  onClick={() => router.push(`/login?redirect=book`)}
                  className="font-bold underline hover:text-white ml-2 shrink-0 cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              
              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="patientName" className="text-xs font-semibold text-slate-300">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    id="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full h-11 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="patientPhone" className="text-xs font-semibold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    name="patientPhone"
                    id="patientPhone"
                    required
                    value={formData.patientPhone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full h-11 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                  />
                </div>
              </div>

              {/* Service & Date selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="service" className="text-xs font-semibold text-slate-300">Specialization / Department *</label>
                  <select
                    name="service"
                    id="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/45 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 appearance-none"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled className="bg-[#0D1F3A] text-white/40">Select treatment area</option>
                    {DEFAULT_SERVICES.map((s) => (
                      <option key={s.slug} value={s.title} className="bg-[#0D1F3A] text-white">{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="scheduleDate" className="text-xs font-semibold text-slate-300">Preferred Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="scheduleDate"
                      id="scheduleDate"
                      required
                      min={minDate}
                      value={formData.scheduleDate}
                      onChange={handleChange}
                      className="w-full h-11 pl-10 pr-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                      style={{ colorScheme: 'dark' }}
                    />
                    <CalendarIcon className="h-4.5 w-4.5 text-brand-cyan/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Time Slots selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-brand-cyan/70" />
                  <span>Choose Time Slot *</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.scheduleTime === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => selectTimeSlot(slot)}
                        className={`h-11 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-gold text-brand-navy shadow-md shadow-brand-gold/10 border-brand-gold font-bold'
                            : 'bg-[#162847]/40 hover:bg-[#162847]/70 text-slate-300 border border-white/10'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 btn-gold rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Confirm Consultation Booking</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Book() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <span className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></span>
      </div>
    }>
      <BookForm />
    </Suspense>
  );
}

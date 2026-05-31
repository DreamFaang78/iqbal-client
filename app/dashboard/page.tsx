'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, FileText, Activity, 
  LogOut, Plus, ShieldCheck, Heart, AlertCircle, 
  RefreshCw, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';

interface AppointmentData {
  _id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  service: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone: string; role: string } | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'medical' | 'wellness'>('overview');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('hommed_token');
    const storedUser = localStorage.getItem('hommed_user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role === 'admin') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    fetchAppointments(token);
  }, []);

  const fetchAppointments = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve appointments.');
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with database.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hommed_token');
    localStorage.removeItem('hommed_user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628] bg-grid relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blob-cyan rounded-full filter blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="text-center space-y-4 z-10">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium tracking-wide">Verifying patient credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Helper stats
  const upcomingAppointments = appointments.filter(a => ['Pending', 'Confirmed', 'Rescheduled'].includes(a.status));
  const completedAppointments = appointments.filter(a => a.status === 'Completed');

  return (
    <div className="min-h-screen bg-[#0A1628] bg-grid py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 blob-cyan rounded-full filter blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 blob-gold rounded-full filter blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full filter blur-3xl -z-10"></div>
          
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-brand-blue/10 text-brand-cyan rounded-2xl border border-brand-cyan/15">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {user.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Active Patient
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Patient ID: <span className="font-mono text-slate-200 font-bold">HM-2026-{user.id.slice(-4).toUpperCase()}</span> • <span className="text-slate-300">{user.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link 
              href="/book" 
              className="flex-1 md:flex-initial h-12 px-5 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-brand-blue/20 text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Book Appointment</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="h-12 px-4 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-rose-400 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-[#0D1F3A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-premium flex items-center justify-between hover:border-brand-cyan/20 transition-all hover:-translate-y-1 duration-300">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Scheduled Slots</span>
              <p className="text-3xl font-extrabold text-white">{upcomingAppointments.length}</p>
            </div>
            <div className="p-3 bg-brand-blue/10 text-brand-cyan rounded-xl border border-brand-blue/20">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#0D1F3A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-premium flex items-center justify-between hover:border-brand-cyan/20 transition-all hover:-translate-y-1 duration-300">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Consultations</span>
              <p className="text-3xl font-extrabold text-white">{completedAppointments.length}</p>
            </div>
            <div className="p-3 bg-brand-cyan/10 text-brand-cyan-light rounded-xl border border-brand-cyan/20">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#0D1F3A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-premium flex items-center justify-between hover:border-brand-cyan/20 transition-all hover:-translate-y-1 duration-300">
            <div className="space-y-1 overflow-hidden pr-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block truncate">Next Consult</span>
              <p className="text-sm font-bold text-slate-200 mt-1 truncate">
                {upcomingAppointments.length > 0 ? (
                  `${upcomingAppointments[0].scheduleDate} @ ${upcomingAppointments[0].scheduleTime}`
                ) : (
                  'No active bookings'
                )}
              </p>
            </div>
            <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-xl border border-brand-purple/20 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-6 overflow-x-auto pb-px">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap px-1 cursor-pointer ${
              activeTab === 'overview' 
                ? 'border-brand-cyan text-brand-cyan-light font-bold' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap px-1 cursor-pointer ${
              activeTab === 'appointments' 
                ? 'border-brand-cyan text-brand-cyan-light font-bold' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button 
            onClick={() => setActiveTab('medical')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap px-1 cursor-pointer ${
              activeTab === 'medical' 
                ? 'border-brand-cyan text-brand-cyan-light font-bold' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Prescriptions & Medical Records
          </button>
          <button 
            onClick={() => setActiveTab('wellness')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap px-1 cursor-pointer ${
              activeTab === 'wellness' 
                ? 'border-brand-cyan text-brand-cyan-light font-bold' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Wellness Tracker
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left column: Upcoming Appointment Info & Quick booking link */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Nearest Appointment Card */}
                <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-premium space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Upcoming Consultations</h3>
                    {upcomingAppointments.length > 0 && (
                      <span className="text-xs text-brand-cyan-light font-bold flex items-center cursor-pointer hover:underline" onClick={() => setActiveTab('appointments')}>
                        View all <ChevronRight className="h-3 w-3 ml-0.5" />
                      </span>
                    )}
                  </div>

                  {upcomingAppointments.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center space-y-4 bg-white/2">
                      <Calendar className="h-10 w-10 text-slate-500 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-300">No scheduled appointments</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Keep your health in check. Schedule your constitutional consultation with Dr. Iqbal today.
                        </p>
                      </div>
                      <Link 
                        href="/book" 
                        className="inline-flex h-10 px-4 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan-light hover:text-brand-navy rounded-xl font-bold text-xs items-center justify-center space-x-1.5 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Schedule Now</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.slice(0, 2).map((appt) => (
                        <div key={appt._id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-cyan/20 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/5 border border-white/15 text-brand-cyan-light rounded-xl">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{appt.service}</span>
                              <p className="font-bold text-white text-sm">{appt.doctorName}</p>
                              <div className="flex items-center space-x-3 text-xs text-slate-400">
                                <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {appt.scheduleTime}</span>
                                <span>•</span>
                                <span>{appt.scheduleDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              appt.status === 'Confirmed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : appt.status === 'Rescheduled'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-brand-blue/15 text-brand-cyan-light border border-brand-blue/20'
                            }`}>
                              {appt.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              appt.paymentStatus === 'Paid' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-white/5 text-slate-400 border border-white/5'
                            }`}>
                              Payment: {appt.paymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Latest Treatment Log Card */}
                <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-premium space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Active Remedy Plan</h3>
                    <span className="text-xs text-brand-cyan-light font-bold flex items-center cursor-pointer hover:underline" onClick={() => setActiveTab('medical')}>
                      Complete History <ChevronRight className="h-3 w-3 ml-0.5" />
                    </span>
                  </div>

                  <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center space-y-3 bg-white/2">
                    <FileText className="h-10 w-10 text-slate-500 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-300">No prescriptions on record yet</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Your remedy plans and prescriptions from Dr. Iqbal will appear here once your first consultation is recorded.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column: Health guidelines & Doctor FAQ */}
              <div className="space-y-6">
                
                {/* General Clinic Information / Google Maps link */}
                <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-premium space-y-4">
                  <h4 className="font-bold text-white">Clinic Consult Info</h4>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start space-x-2.5">
                      <Clock className="h-4.5 w-4.5 text-brand-cyan-light shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">Timings:</p>
                        <p className="text-slate-400">10:00 AM - 2:00 PM</p>
                        <p className="text-slate-400">6:00 PM - 9:00 PM (Sunday Closed)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2.5">
                      <Activity className="h-4.5 w-4.5 text-brand-cyan-light shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">Address:</p>
                        <p className="text-slate-400">Dr IQBAL'S Homeopathy CENTRE</p>
                        <p className="text-slate-400">Kanpur, Uttar Pradesh, India</p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Dr+IQBAL'S+Homeopathy+CENTRE+Kanpur" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-10 border border-white/10 hover:bg-white/5 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Get Directions on Maps</span>
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                {/* Important medical disclaimer alert */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                    <span>Homeopathic Regimen Guideline</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/80 font-light">
                    For optimal absorption of homeopathic globules, do not eat or drink coffee, tea, or raw garlic/onion for 20 minutes before and after taking your remedies. Keep bottles away from direct sunlight and perfumes.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">Appointment Bookings</h3>
                  <p className="text-xs text-slate-400">View status, confirm dates, or book new slots</p>
                </div>
                <button 
                  onClick={() => fetchAppointments(localStorage.getItem('hommed_token') || '')}
                  className="p-2 text-slate-400 hover:text-brand-cyan-light hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                  title="Reload list"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <Calendar className="h-12 w-12 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">No appointments registered under this account.</p>
                  <Link 
                    href="/book" 
                    className="inline-flex h-11 px-5 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white rounded-xl font-semibold text-xs items-center justify-center transition-all shadow-md shadow-brand-blue/15"
                  >
                    Request New Appointment
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pt-1">Specialization / Service</th>
                        <th className="pb-3 pt-1">Doctor</th>
                        <th className="pb-3 pt-1">Scheduled Date & Time</th>
                        <th className="pb-3 pt-1">Status</th>
                        <th className="pb-3 pt-1">Fee Payment</th>
                        <th className="pb-3 pt-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                      {appointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-white/2 transition-colors">
                          <td className="py-4 font-semibold text-white">{appt.service}</td>
                          <td className="py-4 text-slate-400">{appt.doctorName}</td>
                          <td className="py-4">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-200">{appt.scheduleDate}</p>
                              <p className="text-xs text-slate-500">{appt.scheduleTime}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              appt.status === 'Confirmed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : appt.status === 'Rescheduled'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : appt.status === 'Cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : appt.status === 'Completed'
                                ? 'bg-white/5 text-slate-300 border border-white/10'
                                : 'bg-brand-blue/15 text-brand-cyan-light border border-brand-blue/20'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center text-xs font-semibold ${
                              appt.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-slate-500'
                            }`}>
                              {appt.paymentStatus === 'Paid' ? (
                                <><CheckCircle2 className="h-4 w-4 mr-1 shrink-0" /> Paid</>
                              ) : 'Cash / Pending'}
                            </span>
                          </td>
                          <td className="py-4">
                            {['Pending', 'Confirmed'].includes(appt.status) ? (
                              <a 
                                href={`https://wa.me/918707868504?text=Hello%20HOMMED%20clinic%2C%20I%20need%20to%20reschedule%20my%20appointment%20for%20${appt.service}%20on%20${appt.scheduleDate}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-brand-cyan-light hover:text-brand-cyan hover:underline transition-colors"
                              >
                                Modify Slot
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500 italic">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MEDICAL RECORDS TAB */}
          {activeTab === 'medical' && (
            <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
              <div>
                <h3 className="font-bold text-lg text-white">Homeopathy Prescriptions Timeline</h3>
                <p className="text-xs text-slate-400">Track current and past constitutional remedies, dosages, and clinician remarks</p>
              </div>

              <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center space-y-3 bg-white/2">
                <FileText className="h-12 w-12 text-slate-500 mx-auto" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-300">No prescriptions on record yet</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Once Dr. Iqbal records a consultation, your homeopathic remedies, dosages, and clinical remarks will be listed here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* WELLNESS TRACKER TAB */}
          {activeTab === 'wellness' && (
            <div className="bg-[#0D1F3A]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
              <div>
                <h3 className="font-bold text-lg text-white">Constitutional Health & Recovery Tracker</h3>
                <p className="text-xs text-slate-400">Track your healing timeline and immune indicators</p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-xl flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <p className="text-[11px] leading-relaxed text-amber-200/90 font-light">
                  Illustrative sample only. These indicators are example visuals, not measurements derived from your records. Personalised tracking will be available once recovery data is captured during your consultations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="border border-white/5 bg-white/2 p-5 rounded-2xl text-center space-y-3 hover:border-brand-cyan/20 transition-colors">
                  <div className="relative inline-flex items-center justify-center">
                    {/* SVG circular progress */}
                    <svg className="w-24 h-24">
                      <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-brand-cyan" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="30" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <span className="absolute text-white font-bold text-lg">88%</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-white">Symptom Recovery Index</p>
                    <p className="text-[11px] text-slate-400">Overall decrease in symptom severity over last 90 days</p>
                  </div>
                </div>

                <div className="border border-white/5 bg-white/2 p-5 rounded-2xl text-center space-y-3 hover:border-brand-green/20 transition-colors">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24">
                      <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-brand-green" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <span className="absolute text-white font-bold text-lg">80%</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-white">Immune Vitality Score</p>
                    <p className="text-[11px] text-slate-400">Body resistance and adaptation indicators score</p>
                  </div>
                </div>

                <div className="border border-white/5 bg-white/2 p-5 rounded-2xl text-center space-y-3 hover:border-brand-purple/20 transition-colors">
                  <div className="relative inline-flex items-center justify-center">
                    {/* SVG circular progress */}
                    <svg className="w-24 h-24">
                      <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-brand-purple" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="12" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <span className="absolute text-white font-bold text-lg">95%</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-white">Treatment Adherence</p>
                    <p className="text-[11px] text-slate-400">Remedy intake and dietary guideline compliance rate</p>
                  </div>
                </div>

              </div>

              {/* Progress tips */}
              <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 text-slate-300 rounded-2xl space-y-2">
                <p className="font-bold text-xs flex items-center text-brand-cyan-light">
                  <Heart className="h-4.5 w-4.5 text-brand-cyan-light mr-1.5 shrink-0" />
                  Dr. Iqbal's Wellness Recommendation
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                  Your recovery is proceeding very well. The symptoms of hair fall are reduced and scalp health shows excellent repair indicators. Continue the remedies for another 2 weeks. Make sure to consume iron-rich foods, and get at least 7-8 hours of sleep.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

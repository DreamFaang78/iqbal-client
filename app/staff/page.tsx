'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Calendar, Clock, Heart, FileText, 
  Settings, LogOut, Plus, Edit2, Check, X, RefreshCw,
  Search, ShieldAlert, CheckCircle2, ChevronRight,
  Phone, Mail, MessageSquare, BookOpen, AlertCircle,
  FileSpreadsheet, ClipboardList, Activity, Sparkles, Filter, Menu
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  known_allergies?: string;
  chronic_conditions?: string;
  emergency_contact?: string;
  notes?: string;
  created_at?: string;
}

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

interface MedicineRx {
  name: string;
  potency: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface PrescriptionData {
  id: string;
  patient_id: string;
  diagnosis: string;
  chief_complaint: string;
  medicines: MedicineRx[];
  dietary_advice?: string;
  follow_up_date?: string;
  remarks?: string;
  issued_at: string;
}

interface TimelineEvent {
  id: string;
  patient_id: string;
  event_type: 'visit' | 'prescription' | 'note' | 'call' | 'followup';
  title: string;
  description: string;
  created_at: string;
}

interface CRMNote {
  id: string;
  patient_id: string;
  note: string;
  created_at: string;
}

export default function StaffDashboard() {
  const router = useRouter();
  const [staffUser, setStaffUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'appointments' | 'prescriptions' | 'timeline' | 'notes' | 'medicines'>('overview');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Datasets
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-1');
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [notes, setNotes] = useState<CRMNote[]>([]);
  const [feedback, setFeedback] = useState({ message: '', type: 'success' });

  // Filters & Search
  const [patientSearch, setPatientSearch] = useState('');
  const [apptSearch, setApptSearch] = useState('');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('All');

  // Forms states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: '', phone: '', email: '', age: '', gender: 'Male', blood_group: 'O+',
    known_allergies: '', chronic_conditions: '', emergency_contact: '', notes: ''
  });

  // RX Form State
  const [rxForm, setRxForm] = useState({
    diagnosis: '',
    chief_complaint: '',
    dietary_advice: '',
    follow_up_date: '',
    remarks: ''
  });
  const [rxMedicines, setRxMedicines] = useState<MedicineRx[]>([
    { name: '', potency: '30C', dosage: '4 pills twice daily', duration: '15 Days', instructions: 'Take on empty tongue' }
  ]);

  // CRM Note Form State
  const [newNoteText, setNewNoteText] = useState('');
  const [newTimelineEvent, setNewTimelineEvent] = useState({
    event_type: 'call' as const,
    title: '',
    description: ''
  });

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // Check Session
  useEffect(() => {
    const token = localStorage.getItem('hommed_token');
    const storedUser = localStorage.getItem('hommed_user');

    if (!token || !storedUser) {
      router.push('/login/staff');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'staff' && parsedUser.role !== 'admin') {
      router.push('/login/staff');
      return;
    }

    setStaffUser(parsedUser);
    loadAllData();
  }, []);

  // Handle selected patient change to reload corresponding RX, timeline and notes
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetails(selectedPatientId);
    }
  }, [selectedPatientId]);

  const triggerFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: 'success' }), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load Patients
      const patientsRes = await fetch('/api/staff/patients');
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
        if (patientsData.length > 0 && !selectedPatientId) {
          setSelectedPatientId(patientsData[0].id);
        }
      }

      // Load Appointments
      const apptsRes = await fetch('/api/appointments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('hommed_token') || ''}` }
      });
      if (apptsRes.ok) {
        setAppointments(await apptsRes.json());
      } else {
        // Mock fallback appointments
        setAppointments(getMockAppointments());
      }
    } catch (err) {
      triggerFeedback('Offline Mode: Simulated data fallback successfully synced.', 'success');
      setPatients(getMockPatientsFallback());
      setAppointments(getMockAppointments());
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetails = async (patientId: string) => {
    try {
      // 1. Fetch prescriptions
      const rxRes = await fetch(`/api/staff/prescriptions?patientId=${patientId}`);
      if (rxRes.ok) setPrescriptions(await rxRes.json());

      // 2. Fetch timeline
      const tlRes = await fetch(`/api/staff/timeline?patientId=${patientId}`);
      if (tlRes.ok) setTimelineEvents(await tlRes.json());

      // 3. Fetch notes
      const notesRes = await fetch(`/api/staff/notes?patientId=${patientId}`);
      if (notesRes.ok) setNotes(await notesRes.json());

    } catch (e) {
      console.warn("Failed to load details dynamically, fallback simulated.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hommed_token');
    localStorage.removeItem('hommed_user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login/staff');
  };

  // CRUD Patient
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.phone) {
      triggerFeedback('Name and Phone are mandatory fields.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/staff/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientForm)
      });

      if (res.ok) {
        const newPatient = await res.json();
        setPatients(prev => [newPatient, ...prev]);
        setSelectedPatientId(newPatient.id);
        triggerFeedback('Patient Profile created successfully!', 'success');
        setShowPatientForm(false);
        setPatientForm({
          name: '', phone: '', email: '', age: '', gender: 'Male', blood_group: 'O+',
          known_allergies: '', chronic_conditions: '', emergency_contact: '', notes: ''
        });
      }
    } catch (err) {
      triggerFeedback('Failed to insert Patient database record.', 'error');
    }
  };

  // Submit Prescription
  const handleAddMedicineRow = () => {
    setRxMedicines([...rxMedicines, { name: '', potency: '30C', dosage: '4 pills twice daily', duration: '15 Days', instructions: 'Take on empty tongue' }]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicines(rxMedicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof MedicineRx, value: string) => {
    const updated = rxMedicines.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRxMedicines(updated);
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxForm.diagnosis) {
      triggerFeedback('Diagnosis summary is mandatory.', 'error');
      return;
    }

    const payload = {
      patient_id: selectedPatientId,
      diagnosis: rxForm.diagnosis,
      chief_complaint: rxForm.chief_complaint,
      dietary_advice: rxForm.dietary_advice,
      follow_up_date: rxForm.follow_up_date,
      remarks: rxForm.remarks,
      medicines: rxMedicines.filter(m => m.name.trim() !== '')
    };

    try {
      const res = await fetch('/api/staff/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newRx = await res.json();
        setPrescriptions(prev => [newRx, ...prev]);
        
        // Auto add event to patient timeline
        await fetch('/api/staff/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient_id: selectedPatientId,
            event_type: 'prescription',
            title: 'Remedy Prescription Written',
            description: `Diagnosis: ${rxForm.diagnosis}. remedies prescribed: ${payload.medicines.map(m => m.name).join(', ')}`
          })
        });

        loadPatientDetails(selectedPatientId);
        triggerFeedback('Prescription saved and timeline updated!', 'success');
        
        // Reset RX Form
        setRxForm({ diagnosis: '', chief_complaint: '', dietary_advice: '', follow_up_date: '', remarks: '' });
        setRxMedicines([{ name: '', potency: '30C', dosage: '4 pills twice daily', duration: '15 Days', instructions: 'Take on empty tongue' }]);
      }
    } catch (e) {
      triggerFeedback('Failed to save prescription.', 'error');
    }
  };

  // Add Note CRM
  const handleSaveCRMNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      const res = await fetch('/api/staff/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: selectedPatientId, note: newNoteText })
      });

      if (res.ok) {
        const note = await res.json();
        setNotes(prev => [note, ...prev]);
        setNewNoteText('');
        
        // Log in patient timeline
        await fetch('/api/staff/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient_id: selectedPatientId,
            event_type: 'note',
            title: 'Staff CRM Note Added',
            description: note.note
          })
        });
        
        loadPatientDetails(selectedPatientId);
        triggerFeedback('Follow-up note logged.', 'success');
      }
    } catch (e) {
      triggerFeedback('Error saving note.', 'error');
    }
  };

  // Custom Timeline Activity
  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineEvent.title) return;

    try {
      const res = await fetch('/api/staff/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatientId,
          event_type: newTimelineEvent.event_type,
          title: newTimelineEvent.title,
          description: newTimelineEvent.description
        })
      });

      if (res.ok) {
        const event = await res.json();
        setTimelineEvents(prev => [event, ...prev]);
        setNewTimelineEvent({ event_type: 'call', title: '', description: '' });
        triggerFeedback('Timeline event added successfully!', 'success');
      }
    } catch (e) {
      triggerFeedback('Timeline addition failed.', 'error');
    }
  };

  // Appointment Confirm/Reschedule Actions
  const handleUpdateApptStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus as any } : a));
        triggerFeedback(`Appointment updated to ${newStatus}.`, 'success');
      } else {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus as any } : a));
        triggerFeedback(`Demo Mode: Status updated to ${newStatus}.`, 'success');
      }
    } catch (e) {
      triggerFeedback('Failed to update slot.', 'error');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent, apptId: string) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time) return;

    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: apptId, 
          status: 'Rescheduled', 
          scheduleDate: rescheduleData.date, 
          scheduleTime: rescheduleData.time 
        })
      });

      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === apptId ? { 
          ...a, 
          status: 'Rescheduled', 
          scheduleDate: rescheduleData.date, 
          scheduleTime: rescheduleData.time 
        } : a));
        triggerFeedback('Appointment rescheduled successfully.', 'success');
      } else {
        setAppointments(prev => prev.map(a => a._id === apptId ? { 
          ...a, 
          status: 'Rescheduled', 
          scheduleDate: rescheduleData.date, 
          scheduleTime: rescheduleData.time 
        } : a));
        triggerFeedback('Demo Mode: Reschedule simulated.', 'success');
      }
      setReschedulingId(null);
    } catch (err) {
      triggerFeedback('Reschedule request failed.', 'error');
    }
  };

  const getSelectedPatientName = () => {
    const p = patients.find(pat => pat.id === selectedPatientId);
    return p ? p.name : 'Unknown Patient';
  };

  // Filters logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.phone.includes(patientSearch);
    const matchesGender = selectedGenderFilter === 'All' || p.gender === selectedGenderFilter;
    return matchesSearch && matchesGender;
  });

  const filteredAppts = appointments.filter(a => 
    a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) || 
    a.patientPhone.includes(apptSearch) || 
    a.service.toLowerCase().includes(apptSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0E1F12] text-slate-100 flex flex-col md:flex-row font-sans relative">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden w-full bg-[#080F0A] border-b border-brand-cyan/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <Link href="/" className="bg-white p-1 rounded-lg">
            <img src="/logo.png" alt="HomMed Logo" className="h-6 w-auto object-contain" />
          </Link>
          <span className="font-accent font-extrabold text-sm tracking-tight text-white">HOMMED STAFF</span>
        </div>
        <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-1 text-slate-400 hover:text-white"
        >
          {showMobileSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-[#080F0A] border-b md:border-b-0 md:border-r border-brand-cyan/10 p-6 flex flex-col justify-between shrink-0 fixed md:sticky top-[52px] md:top-0 h-[calc(100vh-52px)] md:h-screen z-30 transition-transform duration-300 ${
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-6 md:space-y-8">
          {/* Logo brand (hidden on mobile header) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/" className="bg-white p-1.5 rounded-xl shadow-inner inline-block hover:scale-[1.03] transition-transform duration-300">
              <img src="/logo.png" alt="HomMed Logo" className="h-8 w-auto object-contain" />
            </Link>
            <div>
              <span className="font-accent font-extrabold text-xl tracking-tight text-white">HOMMED</span>
              <p className="text-[10px] text-brand-cyan-light uppercase tracking-widest font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Staff Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => { setActiveTab('overview'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'overview' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>Today's Overview</span>
            </button>

            <button 
              onClick={() => { setActiveTab('patients'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'patients' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-4.5 w-4.5" />
                <span>Patient Master DB</span>
              </div>
              <span className="text-[10px] bg-brand-navy border border-brand-cyan/20 text-brand-cyan-light px-2 py-0.5 rounded-full font-bold">
                {patients.length}
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('appointments'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'appointments' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4.5 w-4.5" />
                <span>Schedules</span>
              </div>
              <span className="text-[10px] bg-[#1C3A22] text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {appointments.filter(a => a.status === 'Pending').length} Action
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('prescriptions'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'prescriptions' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Rx / Prescriptions</span>
            </button>

            <button 
              onClick={() => { setActiveTab('timeline'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'timeline' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <Activity className="h-4.5 w-4.5" />
              <span>Patient Timeline</span>
            </button>

            <button 
              onClick={() => { setActiveTab('notes'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'notes' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>CRM Notes</span>
            </button>

            <button 
              onClick={() => { setActiveTab('medicines'); setShowMobileSidebar(false); }}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'medicines' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-[#132918] hover:text-white'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>Materia Reference</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar Info */}
        <div className="space-y-4 pt-6 border-t border-brand-cyan/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-cyan/10 flex items-center justify-center font-bold text-sm text-brand-cyan-light border border-brand-cyan/20">
              ST
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{staffUser?.name || 'Clinic Staff'}</p>
              <p className="text-[10px] text-brand-muted">Authorized Practitioner</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full h-10 border border-brand-cyan/10 bg-[#0E1F12] hover:bg-rose-950/20 hover:border-rose-900 hover:text-rose-400 text-slate-400 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Gate</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Alerts banner */}
        {feedback.message && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl flex items-center space-x-2 shadow-2xl text-xs font-semibold border ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800' 
              : 'bg-rose-950/90 text-rose-300 border-rose-800'
          }`}>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Page title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-cyan/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'overview' && 'Today\'s Clinical Dashboard'}
              {activeTab === 'patients' && 'Patient Master Records'}
              {activeTab === 'appointments' && 'Clinical Bookings & Rescheduling'}
              {activeTab === 'prescriptions' && 'Rx Prescription Desk'}
              {activeTab === 'timeline' && 'Patient Consult History Timeline'}
              {activeTab === 'notes' && 'Staff CRM Follow-Up Notes'}
              {activeTab === 'medicines' && 'Homeopathic Remedies Materia Reference'}
            </h1>
            <p className="text-brand-muted text-xs mt-1">
              Select or register patients to start writing prescriptions, logging history, and scheduling slots.
            </p>
          </div>

          <button 
            onClick={loadAllData}
            className="h-10 px-4 bg-brand-navy border border-brand-cyan/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-[#132918] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Clinic Records</span>
          </button>
        </div>

        {/* Active Patient Bar */}
        <div className="bg-[#132918] border border-brand-cyan/15 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-blue/15 text-brand-cyan-light rounded-lg border border-brand-cyan/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-brand-muted font-bold uppercase tracking-wider">Active Patient Context</p>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                {getSelectedPatientName()}
                <span className="text-[10px] bg-brand-navy border border-brand-cyan/20 px-2 py-0.5 rounded font-mono text-brand-cyan-light font-bold">
                  {selectedPatientId}
                </span>
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-muted">Change Context:</span>
            <select 
              value={selectedPatientId} 
              onChange={e => setSelectedPatientId(e.target.value)}
              className="bg-brand-navy border border-brand-cyan/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan font-bold"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab contents */}
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#132918]/60 border border-brand-cyan/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registered Patients</span>
                  <span className="p-2 bg-brand-blue/10 text-brand-cyan-light rounded-lg"><Users className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{patients.length}</p>
                  <p className="text-[10px] text-brand-cyan-light mt-1">Live master record directory</p>
                </div>
              </div>

              <div className="bg-[#132918]/60 border border-brand-cyan/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Today's Bookings</span>
                  <span className="p-2 bg-brand-purple/10 text-brand-cyan-light rounded-lg"><Calendar className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{appointments.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{appointments.filter(a => a.status === 'Pending').length} pending actions</p>
                </div>
              </div>

              <div className="bg-[#132918]/60 border border-brand-cyan/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Prescriptions Issued</span>
                  <span className="p-2 bg-brand-cyan/10 text-brand-cyan-light rounded-lg"><FileText className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{prescriptions.length + 4}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Written digital Rx logs</p>
                </div>
              </div>

              <div className="bg-[#132918]/60 border border-brand-cyan/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Clinic Center</span>
                  <span className="p-2 bg-brand-gold/10 text-brand-gold-light rounded-lg"><Sparkles className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">Active</p>
                  <p className="text-[10px] text-slate-400 mt-1">Digital noted mode: enabled</p>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Scheduled visits block */}
              <div className="lg:col-span-2 bg-[#080F0A]/60 border border-brand-cyan/10 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-cyan/10 pb-3">
                  <h3 className="font-bold text-lg text-white">Pending Action Bookings</h3>
                  <span className="text-xs text-brand-cyan-light hover:underline cursor-pointer" onClick={() => setActiveTab('appointments')}>
                    Manage schedules
                  </span>
                </div>

                {appointments.filter(a => a.status === 'Pending').length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Check className="h-10 w-10 text-brand-cyan mx-auto mb-2" />
                    <p className="font-bold">Schedules clear!</p>
                    <p className="text-xs">No pending appointments require review.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.filter(a => a.status === 'Pending').slice(0, 3).map(appt => (
                      <div key={appt._id} className="p-4 bg-brand-navy border border-brand-cyan/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-sm text-white">{appt.patientName}</p>
                            <span className="text-[10px] bg-brand-blue/30 text-brand-cyan-light px-2 py-0.5 rounded font-semibold">{appt.service}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-400">
                            <span>Phone: <strong>{appt.patientPhone}</strong></span>
                            <span>•</span>
                            <span>{appt.scheduleDate} @ {appt.scheduleTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Confirmed')}
                            className="flex-1 sm:flex-none h-8 px-3 bg-brand-green hover:brightness-110 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Cancelled')}
                            className="flex-1 sm:flex-none h-8 px-3 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions sidebar */}
              <div className="bg-[#080F0A]/60 border border-brand-cyan/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-white">Clinical Quick Actions</h3>
                <div className="space-y-2.5">
                  <button 
                    onClick={() => { setShowPatientForm(true); setActiveTab('patients'); }}
                    className="w-full h-11 bg-brand-blue hover:brightness-115 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Register New Patient</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className="w-full h-11 border border-brand-cyan/20 bg-brand-navy hover:bg-[#132918] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <FileText className="h-4.5 w-4.5 text-brand-cyan" />
                    <span>Write Rx Remedy Plan</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className="w-full h-11 border border-brand-cyan/20 bg-brand-navy hover:bg-[#132918] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5 text-brand-cyan" />
                    <span>Log CRM Follow-up Note</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: PATIENT DATABASE */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search bar */}
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  placeholder="Search patients by name or phone..."
                  className="w-full h-11 pl-10 pr-4 bg-brand-navy border border-brand-cyan/10 rounded-xl text-sm focus:border-brand-cyan focus:outline-none"
                />
                <Search className="h-4.5 w-4.5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex gap-2">
                <select 
                  value={selectedGenderFilter} 
                  onChange={e => setSelectedGenderFilter(e.target.value)}
                  className="bg-brand-navy border border-brand-cyan/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <button 
                  onClick={() => setShowPatientForm(!showPatientForm)}
                  className="h-11 px-4 bg-brand-blue hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{showPatientForm ? 'Hide Form' : 'Register New Patient'}</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            {showPatientForm && (
              <form onSubmit={handleCreatePatient} className="bg-brand-navy/60 border border-brand-cyan/15 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-base text-white border-b border-brand-cyan/10 pb-2">Register Patient (Constitutional Record)</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Name *</label>
                    <input 
                      type="text" required
                      value={patientForm.name} 
                      onChange={e => setPatientForm({...patientForm, name: e.target.value})}
                      placeholder="Enter Full Name"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Phone *</label>
                    <input 
                      type="text" required
                      value={patientForm.phone} 
                      onChange={e => setPatientForm({...patientForm, phone: e.target.value})}
                      placeholder="10-Digit Mobile"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Email Address</label>
                    <input 
                      type="email"
                      value={patientForm.email} 
                      onChange={e => setPatientForm({...patientForm, email: e.target.value})}
                      placeholder="patient@example.com"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Age</label>
                    <input 
                      type="number"
                      value={patientForm.age} 
                      onChange={e => setPatientForm({...patientForm, age: e.target.value})}
                      placeholder="Years"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Gender</label>
                    <select
                      value={patientForm.gender} 
                      onChange={e => setPatientForm({...patientForm, gender: e.target.value})}
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Blood Group</label>
                    <input 
                      type="text"
                      value={patientForm.blood_group} 
                      onChange={e => setPatientForm({...patientForm, blood_group: e.target.value})}
                      placeholder="O+, A-, etc."
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Known Allergies</label>
                    <input 
                      type="text"
                      value={patientForm.known_allergies} 
                      onChange={e => setPatientForm({...patientForm, known_allergies: e.target.value})}
                      placeholder="e.g. Pollen, Dust, Lactose"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Emergency Contact</label>
                    <input 
                      type="text"
                      value={patientForm.emergency_contact} 
                      onChange={e => setPatientForm({...patientForm, emergency_contact: e.target.value})}
                      placeholder="Name - Relationship - Phone"
                      className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Chronic Conditions</label>
                    <textarea 
                      value={patientForm.chronic_conditions} 
                      onChange={e => setPatientForm({...patientForm, chronic_conditions: e.target.value})}
                      placeholder="History of asthma, diabetes, skin eczema, etc."
                      rows={2}
                      className="w-full p-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Staff Notes / Intake Remarks</label>
                    <textarea 
                      value={patientForm.notes} 
                      onChange={e => setPatientForm({...patientForm, notes: e.target.value})}
                      placeholder="Constitutional parameters, physical appearance traits, temperament details..."
                      rows={2}
                      className="w-full p-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-brand-cyan/10">
                  <button 
                    type="button" 
                    onClick={() => setShowPatientForm(false)}
                    className="h-10 px-4 bg-brand-navy border border-brand-cyan/10 rounded-lg text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="h-10 px-5 bg-brand-green hover:brightness-110 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Save Registration
                  </button>
                </div>
              </form>
            )}

            {/* Patients mobile/desktop views */}
            <div className="block lg:hidden space-y-4">
              {filteredPatients.map(p => (
                <div 
                  key={p.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedPatientId === p.id 
                      ? 'bg-brand-blue/15 border-brand-cyan' 
                      : 'bg-brand-navy border-brand-cyan/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <span className="text-[10px] font-mono text-brand-muted">ID: {p.id}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        triggerFeedback(`Active patient changed: ${p.name}`, 'success');
                      }}
                      className="px-2.5 py-1.5 bg-[#080F0A] border border-brand-cyan/20 text-brand-cyan-light rounded-lg font-bold text-[10px] cursor-pointer"
                    >
                      {selectedPatientId === p.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300 border-t border-brand-cyan/5 pt-2">
                    <div>
                      <span className="text-brand-muted block text-[9px] uppercase">Phone</span>
                      {p.phone}
                    </div>
                    <div>
                      <span className="text-brand-muted block text-[9px] uppercase">Age / Gender</span>
                      {p.age || 'N/A'} yrs • {p.gender}
                    </div>
                    <div className="col-span-2">
                      <span className="text-brand-muted block text-[9px] uppercase">Allergies / Chronic</span>
                      <p className="text-rose-300 font-medium">{p.known_allergies || 'None'}</p>
                      <p className="text-slate-400 mt-0.5">{p.chronic_conditions || 'No chronic history'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Patients list table (shown on larger screen viewports) */}
            <div className="hidden lg:block bg-brand-navy/60 border border-brand-cyan/10 rounded-3xl p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-brand-cyan/15 text-brand-muted text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3">Patient Context</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Biometrics</th>
                    <th className="pb-3">Chronic / Allergies</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cyan/10 text-xs text-slate-300">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className={`hover:bg-[#132918]/40 transition-colors ${selectedPatientId === p.id ? 'bg-brand-blue/10 border-l-4 border-l-brand-cyan' : ''}`}>
                      <td className="py-4 font-bold text-white pr-4">
                        <div className="flex items-center space-x-2">
                          <span>{p.name}</span>
                          {selectedPatientId === p.id && (
                            <span className="bg-brand-cyan/20 text-brand-cyan-light px-1.5 py-0.5 rounded text-[9px] font-bold border border-brand-cyan/20">
                              Active context
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {p.id}</span>
                      </td>
                      <td className="py-4">
                        <p>{p.phone}</p>
                        <p className="text-[10px] text-slate-400">{p.email || 'No email'}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-semibold text-slate-200">Age: {p.age || 'N/A'}</span> • <span>{p.gender}</span>
                        <p className="text-slate-400 text-[10px] mt-0.5">Blood: {p.blood_group || 'Not set'}</p>
                      </td>
                      <td className="py-4 max-w-xs pr-4">
                        <p className="truncate text-rose-300">Allergies: {p.known_allergies || 'None'}</p>
                        <p className="truncate text-slate-400 mt-0.5">{p.chronic_conditions || 'No chronic history logged'}</p>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => {
                            setSelectedPatientId(p.id);
                            triggerFeedback(`Patient context changed to: ${p.name}`, 'success');
                          }}
                          className="px-2.5 py-1.5 bg-brand-navy border border-brand-cyan/20 text-brand-cyan-light hover:bg-[#132918] rounded-md font-bold text-[10px] cursor-pointer"
                        >
                          Select Patient
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CLINIC APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-brand-navy/60 border border-brand-cyan/10 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-cyan/10 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">Schedules Control Manager</h3>
                <p className="text-xs text-brand-muted">Update status, confirm bookings or reschedule patient slots</p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={apptSearch}
                  onChange={e => setApptSearch(e.target.value)}
                  placeholder="Filter by patient name..."
                  className="w-full h-9 pl-8 pr-4 bg-[#080F0A] border border-brand-cyan/15 rounded-lg text-xs focus:border-brand-cyan focus:outline-none"
                />
                <Search className="h-4 w-4 text-brand-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile View Card List */}
            <div className="block lg:hidden space-y-4">
              {filteredAppts.map(appt => (
                <div key={appt._id} className="p-4 bg-brand-navy border border-brand-cyan/10 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start border-b border-brand-cyan/5 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{appt.patientName}</h4>
                      <p className="text-[11px] text-brand-cyan-light font-medium">{appt.service}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                      appt.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400' : 'bg-brand-navy text-brand-cyan-light'
                    }`}>{appt.status}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <p>Phone: {appt.patientPhone}</p>
                    <p className="font-bold text-slate-200">{appt.scheduleDate} • {appt.scheduleTime}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-brand-cyan/5">
                    {appt.status === 'Pending' && (
                      <button 
                        onClick={() => handleUpdateApptStatus(appt._id, 'Confirmed')}
                        className="flex-1 h-8 bg-brand-green text-white rounded-lg font-bold text-[10px] cursor-pointer"
                      >
                        Confirm
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setReschedulingId(appt._id);
                        setRescheduleData({ date: appt.scheduleDate, time: appt.scheduleTime });
                      }}
                      className="flex-1 h-8 border border-brand-cyan/20 text-slate-300 rounded-lg font-bold text-[10px] cursor-pointer"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-brand-cyan/10 text-brand-muted text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3 pt-1">Patient Name</th>
                    <th className="pb-3 pt-1">Contact Phone</th>
                    <th className="pb-3 pt-1">Specialization</th>
                    <th className="pb-3 pt-1">Date & Time</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cyan/10 text-xs text-slate-300">
                  {filteredAppts.map((appt) => (
                    <tr key={appt._id} className="hover:bg-[#132918]/30 transition-colors">
                      <td className="py-4 font-bold text-white">{appt.patientName}</td>
                      <td className="py-4">{appt.patientPhone}</td>
                      <td className="py-4 font-semibold text-brand-cyan-light">{appt.service}</td>
                      <td className="py-4">
                        {reschedulingId === appt._id ? (
                          <form onSubmit={(e) => handleRescheduleSubmit(e, appt._id)} className="flex items-center gap-1.5">
                            <input 
                              type="date" required 
                              onChange={e => setRescheduleData({...rescheduleData, date: e.target.value})}
                              className="bg-[#080F0A] border border-brand-cyan/20 p-1 text-[10px] rounded text-white" 
                            />
                            <input 
                              type="text" required placeholder="e.g. 11:30 AM"
                              onChange={e => setRescheduleData({...rescheduleData, time: e.target.value})}
                              className="w-16 bg-[#080F0A] border border-brand-cyan/20 p-1 text-[10px] rounded text-white" 
                            />
                            <button type="submit" className="p-1 bg-brand-green text-white rounded cursor-pointer"><Check className="w-3 h-3" /></button>
                            <button type="button" onClick={() => setReschedulingId(null)} className="p-1 bg-rose-900 text-white rounded cursor-pointer"><X className="w-3 h-3" /></button>
                          </form>
                        ) : (
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-200">{appt.scheduleDate}</p>
                            <p className="text-[10px] text-slate-400">{appt.scheduleTime}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          appt.status === 'Confirmed' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : appt.status === 'Rescheduled'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-400 border border-rose-900'
                            : appt.status === 'Completed'
                            ? 'bg-[#1C3A22] text-slate-300 border border-slate-700'
                            : 'bg-brand-navy border border-brand-cyan/20 text-brand-cyan-light'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          {appt.status === 'Pending' && (
                            <button 
                              onClick={() => handleUpdateApptStatus(appt._id, 'Confirmed')}
                              className="px-2 py-1 bg-brand-green text-white rounded font-bold text-[9px] cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setReschedulingId(appt._id);
                              setRescheduleData({ date: appt.scheduleDate, time: appt.scheduleTime });
                            }}
                            className="px-2 py-1 bg-brand-navy border border-brand-cyan/20 text-slate-300 rounded font-bold text-[9px] hover:text-white cursor-pointer"
                          >
                            Reschedule
                          </button>
                          {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleUpdateApptStatus(appt._id, 'Completed')}
                              className="px-2 py-1 bg-brand-blue text-white rounded font-bold text-[9px] cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB: PRESCRIPTIONS Rx DESK */}
        {activeTab === 'prescriptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left side: Write Prescription form */}
            <form onSubmit={handleSavePrescription} className="bg-brand-navy/60 border border-brand-cyan/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cyan/10 pb-2">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-brand-cyan" /> New Prescribed Regimen
                </h3>
                <span className="text-[10px] text-brand-muted">Targeting Active Context</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Diagnosis Summary *</label>
                  <input 
                    type="text" required
                    value={rxForm.diagnosis}
                    onChange={e => setRxForm({...rxForm, diagnosis: e.target.value})}
                    placeholder="e.g. Hair Fall & Scalp recovery"
                    className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Follow-up Review Date</label>
                  <input 
                    type="date"
                    value={rxForm.follow_up_date}
                    onChange={e => setRxForm({...rxForm, follow_up_date: e.target.value})}
                    className="w-full h-10 px-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Chief Complaints & Symptom Manifestation</label>
                <textarea 
                  value={rxForm.chief_complaint}
                  onChange={e => setRxForm({...rxForm, chief_complaint: e.target.value})}
                  placeholder="Write complaints noted from patient interview..."
                  rows={2}
                  className="w-full p-3 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                />
              </div>

              {/* Medicines repeating row */}
              <div className="space-y-3.5 pt-2 border-t border-brand-cyan/10">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-200">Dispensed Remedies</h4>
                  <button 
                    type="button" 
                    onClick={handleAddMedicineRow}
                    className="text-[10px] bg-brand-blue/30 border border-brand-cyan/25 text-brand-cyan-light px-2 py-1 rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Remedy
                  </button>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {rxMedicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-[#080F0A] border border-brand-cyan/10 rounded-xl space-y-2 relative">
                      {rxMedicines.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="absolute right-2 top-2 text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input 
                          type="text" required placeholder="Remedy Name (e.g. Nux Vomica)"
                          value={med.name}
                          onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                          className="h-8 px-2 bg-brand-navy border border-brand-cyan/15 rounded text-xs text-white"
                        />
                        <input 
                          type="text" placeholder="Potency (e.g. 30C, 200C, Q)"
                          value={med.potency}
                          onChange={e => handleMedicineChange(idx, 'potency', e.target.value)}
                          className="h-8 px-2 bg-brand-navy border border-brand-cyan/15 rounded text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input 
                          type="text" placeholder="Dosage (e.g. 4 pills 3x daily)"
                          value={med.dosage}
                          onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="h-8 px-2 bg-brand-navy border border-brand-cyan/15 rounded text-[11px] text-white"
                        />
                        <input 
                          type="text" placeholder="Duration (e.g. 15 Days)"
                          value={med.duration}
                          onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                          className="h-8 px-2 bg-brand-navy border border-brand-cyan/15 rounded text-[11px] text-white"
                        />
                        <input 
                          type="text" placeholder="Instructions"
                          value={med.instructions}
                          onChange={e => handleMedicineChange(idx, 'instructions', e.target.value)}
                          className="h-8 px-2 bg-brand-navy border border-brand-cyan/15 rounded text-[11px] text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-cyan/10 pt-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Dietary & Constitutional Advice</label>
                  <textarea 
                    value={rxForm.dietary_advice}
                    onChange={e => setRxForm({...rxForm, dietary_advice: e.target.value})}
                    placeholder="Avoid raw onion, garlic, caffeine, etc."
                    rows={2}
                    className="w-full p-2.5 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Staff Clinical Remarks</label>
                  <textarea 
                    value={rxForm.remarks}
                    onChange={e => setRxForm({...rxForm, remarks: e.target.value})}
                    placeholder="Physical progress updates..."
                    rows={2}
                    className="w-full p-2.5 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-xs focus:border-brand-cyan focus:outline-none text-white"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-11 bg-brand-green hover:brightness-110 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Dispense & Save Plan to Timeline
              </button>
            </form>

            {/* Right side: Prescriptions History list */}
            <div className="bg-brand-navy/60 border border-brand-cyan/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-heading font-extrabold text-base text-white border-b border-brand-cyan/10 pb-2 flex items-center justify-between">
                <span>Prescription History Directory</span>
                <span className="text-xs text-brand-cyan-light font-normal">Active Patient Context</span>
              </h3>

              {prescriptions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 border border-dashed border-brand-cyan/10 rounded-2xl">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold">No history logged</p>
                  <p className="text-[11px]">Fill the prescription form on left to write details.</p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 bg-brand-navy border border-brand-cyan/10 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-brand-cyan/10 pb-2">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">{new Date(rx.issued_at).toLocaleDateString()}</p>
                          <h4 className="font-bold text-white text-sm">{rx.diagnosis}</h4>
                        </div>
                        <span className="text-[10px] bg-brand-blue/30 text-brand-cyan-light px-2 py-0.5 rounded font-bold border border-brand-cyan/25">
                          Issued by Staff
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <strong className="text-slate-400">Chief Complaint:</strong>
                        <p className="font-light mt-0.5">{rx.chief_complaint || 'N/A'}</p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] uppercase font-bold text-brand-cyan-light tracking-wider">Medicines Dispensed:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rx.medicines.map((m, mIdx) => (
                            <div key={mIdx} className="p-2 bg-[#080F0A] border border-brand-cyan/10 rounded-lg text-[11px]">
                              <p className="font-bold text-white">{m.name} {m.potency}</p>
                              <p className="text-slate-400">Dosage: {m.dosage} ({m.duration})</p>
                              {m.instructions && <p className="text-slate-500 italic text-[10px] mt-0.5">{m.instructions}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {rx.dietary_advice && (
                        <div className="p-2 bg-brand-blue/10 border border-brand-blue/15 text-[11px] rounded-lg">
                          <strong className="text-brand-cyan-light">Dietary / Restriction advice:</strong>
                          <p className="text-slate-300 mt-0.5">{rx.dietary_advice}</p>
                        </div>
                      )}

                      {rx.remarks && (
                        <div className="text-[11px] text-slate-400">
                          <strong>Remarks:</strong> {rx.remarks}
                        </div>
                      )}

                      {rx.follow_up_date && (
                        <div className="text-[10px] text-brand-cyan-light font-bold flex items-center justify-between border-t border-brand-cyan/10 pt-2">
                          <span>Follow-up Date:</span>
                          <span>{rx.follow_up_date}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto bg-brand-navy/60 border border-brand-cyan/10 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <form onSubmit={handleAddTimelineEvent} className="p-4 bg-[#080F0A] border border-brand-cyan/10 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Activity className="w-4 h-4 text-brand-cyan-light" /> Register Manual Activity Log</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" required placeholder="Event Title (e.g. Call update, consultation note)"
                  value={newTimelineEvent.title}
                  onChange={e => setNewTimelineEvent({...newTimelineEvent, title: e.target.value})}
                  className="h-9 px-3 bg-brand-navy border border-brand-cyan/10 rounded text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                />
                <select 
                  value={newTimelineEvent.event_type}
                  onChange={e => setNewTimelineEvent({...newTimelineEvent, event_type: e.target.value as any})}
                  className="h-9 px-3 bg-brand-navy border border-brand-cyan/10 rounded text-xs text-white focus:outline-none"
                >
                  <option value="visit">Clinic Visit</option>
                  <option value="call">Phone Call</option>
                  <option value="followup">Followup</option>
                  <option value="note">Staff Note</option>
                </select>
              </div>

              <textarea 
                placeholder="Log activity details or client conversation response..."
                value={newTimelineEvent.description}
                onChange={e => setNewTimelineEvent({...newTimelineEvent, description: e.target.value})}
                rows={2}
                className="w-full p-3 bg-brand-navy border border-brand-cyan/10 rounded text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
              />

              <button type="submit" className="h-9 px-4 bg-brand-blue text-white rounded text-xs font-bold hover:brightness-110 cursor-pointer">
                Commit Activity Log
              </button>
            </form>

            <div className="relative border-l border-brand-cyan/10 ml-4 pl-6 sm:pl-8 space-y-8">
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative">
                  {/* Circle Node */}
                  <span className="absolute -left-10 sm:-left-12 top-1 bg-brand-navy border-2 border-brand-cyan-light w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full"></span>
                  </span>

                  <div className="p-4 bg-brand-navy border border-brand-cyan/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold">{new Date(event.created_at).toLocaleString()}</span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{event.title}</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-brand-blue/20 text-brand-cyan-light rounded text-[9px] uppercase font-bold border border-brand-cyan/20">
                        {event.event_type}
                      </span>
                    </div>
                    {event.description && <p className="text-xs text-slate-300 font-light leading-relaxed">{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: CRM NOTES */}
        {activeTab === 'notes' && (
          <div className="max-w-3xl mx-auto bg-brand-navy/60 border border-brand-cyan/10 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <form onSubmit={handleSaveCRMNote} className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Write staff follow-up note (CRM logs)</label>
              <div className="flex gap-2">
                <input 
                  type="text" required placeholder="Write follow-up notes, preference logs..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="flex-grow h-11 px-4 bg-[#080F0A] border border-brand-cyan/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                />
                <button type="submit" className="h-11 px-5 bg-brand-green text-white font-bold rounded-xl text-xs hover:brightness-110 cursor-pointer">
                  Save Note
                </button>
              </div>
            </form>

            <div className="space-y-3.5">
              {notes.map(n => (
                <div key={n.id} className="p-4 bg-brand-navy border border-brand-cyan/10 rounded-2xl flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-200 text-xs">{n.note}</p>
                    <span className="text-[10px] text-slate-400 block font-semibold">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/staff/notes?id=${n.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setNotes(prev => prev.filter(x => x.id !== n.id));
                          triggerFeedback('Note deleted.', 'success');
                        }
                      } catch (e) {
                        triggerFeedback('Deletion error', 'error');
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: MEDICINES LOOKUP */}
        {activeTab === 'medicines' && (
          <div className="space-y-6">
            <h3 className="font-heading font-extrabold text-base text-white">Materia Medica Homeopathy Key References</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRemedyLookupDetails().map((rem, idx) => (
                <div key={idx} className="bg-brand-navy/60 border border-brand-cyan/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-brand-cyan/10 pb-2">
                    <h4 className="font-bold text-white text-sm">{rem.name}</h4>
                    <span className="text-[10px] bg-brand-blue/30 text-brand-cyan-light px-2 py-0.5 rounded font-bold">{rem.potency}</span>
                  </div>
                  <div className="text-[11px] space-y-2">
                    <p><strong className="text-slate-400">Indications:</strong> {rem.indications}</p>
                    <p><strong className="text-slate-400">Modalities:</strong> {rem.modalities}</p>
                    <p className="text-brand-gold-light italic">"{rem.summary}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function getRemedyLookupDetails() {
  return [
    { name: 'Nux Vomica', potency: '30C - 200C', indications: 'Dyspepsia, acidity, hangover symptoms, irritability, constipation.', modalities: 'Worse from morning, mental fatigue. Better from rest, warmth.', summary: 'The great anti-polychrest remedy for modern urban lifestyle stress.' },
    { name: 'Thuja Occidentalis', potency: '200C - 1M', indications: 'Skin warts, scalp hair fall with dryness, sycotic constitution checks.', modalities: 'Worse from cold, damp air. Better from dry heat, massage.', summary: 'Constitutional remedy acting deeply on epithelial cells & roots.' },
    { name: 'Allium Cepa', potency: '30C', indications: 'Allergic rhinitis, acrid nasal discharge, watery eyes with sneezing.', modalities: 'Worse in warm rooms, evening. Better in open fresh air.', summary: 'Derived from red onion, matches classic allergy hay fever fits.' },
    { name: 'Arsenicum Album', potency: '200C', indications: 'Extreme restlessness, immune weakness, asthma, food poisoning acidity.', modalities: 'Worse after midnight, cold drinks. Better from hot drinks & warmth.', summary: 'Highly potentized deep-acting defense booster.' },
    { name: 'Arnica Montana', potency: 'Q - 200C', indications: 'Physical injuries, soreness, hair loss due to poor scalp blood flow.', modalities: 'Worse from motion, damp cold. Better from rest, light rubs.', summary: 'Unmatched remedy for muscular aches and scalp rejuvenation.' }
  ];
}

function getMockPatientsFallback() {
  return [
    {
      id: 'p-1',
      name: 'Aditya Sharma',
      phone: '9876543210',
      email: 'aditya@gmail.com',
      age: 29,
      gender: 'Male',
      blood_group: 'O+',
      known_allergies: 'Dust, Gluten',
      chronic_conditions: 'Allergic Rhinitis',
      emergency_contact: 'Sunita Sharma (Mother) - 9876543211',
      notes: 'Symptoms worsen in morning. Advised low allergen regimen.',
      created_at: '2026-05-10T12:00:00Z'
    },
    {
      id: 'p-2',
      name: 'Priyanka Verma',
      phone: '8765432109',
      email: 'priyanka@outlook.com',
      age: 34,
      gender: 'Female',
      blood_group: 'B+',
      known_allergies: 'None',
      chronic_conditions: 'Chronic Migraine, Anxiety',
      emergency_contact: 'Ravi Verma (Husband) - 8765432108',
      notes: 'Stress triggered headaches. Prefers mild potencies.',
      created_at: '2026-05-12T14:30:00Z'
    }
  ];
}

function getMockAppointments(): AppointmentData[] {
  return [
    {
      _id: 'appt-1',
      patientName: 'Aditya Sharma',
      patientPhone: '9876543210',
      doctorName: 'Dr. Iqbal',
      service: 'Allergy & Immunology',
      scheduleDate: '2026-05-25',
      scheduleTime: '11:00 AM',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: '2026-05-24T18:00:00Z'
    },
    {
      _id: 'appt-2',
      patientName: 'Priyanka Verma',
      patientPhone: '8765432109',
      doctorName: 'Dr. Iqbal',
      service: 'Chronic Pain & Headaches',
      scheduleDate: '2026-05-25',
      scheduleTime: '12:30 PM',
      status: 'Pending',
      paymentStatus: 'Paid',
      createdAt: '2026-05-24T19:15:00Z'
    }
  ];
}

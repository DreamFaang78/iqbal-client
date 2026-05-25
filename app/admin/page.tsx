'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Calendar, Clock, Layers, FileText, 
  Settings, LogOut, Plus, Edit2, Trash2, 
  ToggleLeft, ToggleRight, Check, X, RefreshCw,
  Search, ShieldAlert, Award, ArrowUpRight, BarChart3,
  ListFilter, LayoutGrid, CheckCircle2, ChevronRight,
  Phone, Mail, MessageSquare
} from 'lucide-react';

interface LeadData {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  inquiry: string;
  status: 'New Lead' | 'Contacted' | 'Consultation Scheduled' | 'Follow-Up Required' | 'Converted' | 'Closed';
  createdAt: string;
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

interface ServiceData {
  _id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  symptoms: string[];
  treatments: string[];
}

interface BlogData {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string;
  publishedAt: string;
}

interface PopupData {
  _id: string;
  type: 'appointment' | 'exit' | 'offer' | 'whatsapp' | 'lead_capture';
  title: string;
  content: string;
  isActive: boolean;
  delaySeconds: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'appointments' | 'services' | 'blogs' | 'popups' | 'staff'>('analytics');
  const [staffList, setStaffList] = useState<any[]>([
    { id: 'st-1', name: 'Ayush Rawat', email: 'ayush.staff@hommed.com', phone: '8877665544', role: 'staff', status: 'Active' },
    { id: 'st-2', name: 'Nisha Pathak', email: 'nisha.staff@hommed.com', phone: '9900887766', role: 'staff', status: 'Active' }
  ]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', phone: '', password: '' });

  // Datasets
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [popups, setPopups] = useState<PopupData[]>([]);

  // Search & Filters
  const [leadSearch, setLeadSearch] = useState('');
  const [apptSearch, setApptSearch] = useState('');

  // Form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '', icon: 'Sparkles', shortDescription: '', detailedDescription: '', symptoms: '', treatments: ''
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', category: 'General Health', excerpt: '', content: '', image: ''
  });

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // Notifications / Feedback
  const [feedback, setFeedback] = useState({ message: '', type: 'success' });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('hommed_token');
    const storedUser = localStorage.getItem('hommed_user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setAdminUser(parsedUser);
    loadAllData(token);
  }, []);

  const loadAllData = async (token: string) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load leads
      const leadsRes = await fetch('/api/leads', { headers });
      if (leadsRes.ok) setLeads(await leadsRes.json());

      // Load appointments
      const apptsRes = await fetch('/api/appointments', { headers });
      if (apptsRes.ok) setAppointments(await apptsRes.json());

      // Load services
      const servicesRes = await fetch('/api/services');
      if (servicesRes.ok) setServices(await servicesRes.json());

      // Load blogs
      const blogsRes = await fetch('/api/blogs');
      if (blogsRes.ok) setBlogs(await blogsRes.json());

      // Load popups
      const popupsRes = await fetch('/api/popups');
      if (popupsRes.ok) setPopups(await popupsRes.json());

    } catch (err) {
      triggerFeedback('Error communicating with database API, loaded local fallback parameters.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: 'success' }), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('hommed_token');
    localStorage.removeItem('hommed_user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  // Appointment Status Updates
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
        // Fallback for demo
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus as any } : a));
        triggerFeedback(`Demo Mode: Status simulated to ${newStatus}.`, 'success');
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

  // Lead Status Updates
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus as any } : l));
        triggerFeedback(`Lead moved to ${newStatus}.`, 'success');
      } else {
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus as any } : l));
        triggerFeedback(`Demo Mode: Status simulated to ${newStatus}.`, 'success');
      }
    } catch (e) {
      triggerFeedback('Failed to update lead status.', 'error');
    }
  };

  // Toggle Popup trigger
  const handleTogglePopup = async (popupId: string, currentActive: boolean) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/popups', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: popupId, isActive: !currentActive })
      });

      if (res.ok) {
        const data = await res.json();
        // Reload popups list since activating one will deactivate other popups
        const popupsRes = await fetch('/api/popups');
        if (popupsRes.ok) setPopups(await popupsRes.json());
        triggerFeedback('Popup banner toggled successfully.', 'success');
      } else {
        // Fallback simulation
        setPopups(prev => prev.map(p => p._id === popupId ? { ...p, isActive: !currentActive } : { ...p, isActive: p._id === popupId ? !currentActive : false }));
        triggerFeedback('Demo Mode: Popup settings saved.', 'success');
      }
    } catch (e) {
      triggerFeedback('Failed to toggle popup configuration.', 'error');
    }
  };

  // Services Management
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('hommed_token');
      const payload = {
        ...serviceForm,
        symptoms: serviceForm.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        treatments: serviceForm.treatments.split(',').map(t => t.trim()).filter(Boolean)
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setServices(prev => [data.service, ...prev]);
        triggerFeedback('New specialization service added!', 'success');
        setShowServiceForm(false);
        setServiceForm({ title: '', icon: 'Sparkles', shortDescription: '', detailedDescription: '', symptoms: '', treatments: '' });
      } else {
        const mockNew = {
          ...payload,
          slug: serviceForm.title.toLowerCase().replace(/\s+/g, '-'),
          _id: `mock-srv-${Date.now()}`
        };
        setServices(prev => [mockNew, ...prev]);
        triggerFeedback('Demo Mode: Specialization simulated.', 'success');
        setShowServiceForm(false);
        setServiceForm({ title: '', icon: 'Sparkles', shortDescription: '', detailedDescription: '', symptoms: '', treatments: '' });
      }
    } catch (err) {
      triggerFeedback('Failed to add service.', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specialization?')) return;
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setServices(prev => prev.filter(s => s._id !== id));
        triggerFeedback('Specialization deleted.', 'success');
      } else {
        setServices(prev => prev.filter(s => s._id !== id));
        triggerFeedback('Demo Mode: Deleted specialization.', 'success');
      }
    } catch (err) {
      triggerFeedback('Error deleting service.', 'error');
    }
  };

  // Blogs CMS Management
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });

      if (res.ok) {
        const data = await res.json();
        setBlogs(prev => [data.blog, ...prev]);
        triggerFeedback('Medical blog article published!', 'success');
        setShowBlogForm(false);
        setBlogForm({ title: '', category: 'General Health', excerpt: '', content: '', image: '' });
      } else {
        const mockNew = {
          ...blogForm,
          slug: blogForm.title.toLowerCase().replace(/\s+/g, '-'),
          author: 'Dr. Iqbal',
          publishedAt: new Date().toISOString(),
          _id: `mock-blog-${Date.now()}`
        };
        setBlogs(prev => [mockNew, ...prev]);
        triggerFeedback('Demo Mode: Article publication simulated.', 'success');
        setShowBlogForm(false);
        setBlogForm({ title: '', category: 'General Health', excerpt: '', content: '', image: '' });
      }
    } catch (err) {
      triggerFeedback('Failed to publish article.', 'error');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setBlogs(prev => prev.filter(b => b._id !== id));
        triggerFeedback('Blog post deleted.', 'success');
      } else {
        setBlogs(prev => prev.filter(b => b._id !== id));
        triggerFeedback('Demo Mode: Article deleted.', 'success');
      }
    } catch (err) {
      triggerFeedback('Error deleting blog post.', 'error');
    }
  };

  if (loading && !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium">Validating administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) return null;

  // Filter lists
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
    l.phone.includes(leadSearch) ||
    (l.inquiry && l.inquiry.toLowerCase().includes(leadSearch.toLowerCase()))
  );

  const filteredAppts = appointments.filter(a => 
    a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) || 
    a.patientPhone.includes(apptSearch) || 
    a.service.toLowerCase().includes(apptSearch.toLowerCase())
  );

  // Kanban setup
  const kanbanColumns = [
    { id: 'New Lead', label: 'New Leads', color: 'bg-blue-500' },
    { id: 'Contacted', label: 'Contacted', color: 'bg-cyan-500' },
    { id: 'Consultation Scheduled', label: 'Appt Scheduled', color: 'bg-purple-500' },
    { id: 'Follow-Up Required', label: 'Follow-Up', color: 'bg-amber-500' },
    { id: 'Converted', label: 'Converted Patient', color: 'bg-emerald-500' },
    { id: 'Closed', label: 'Closed/Archive', color: 'bg-slate-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="bg-white p-1.5 rounded-xl shadow-inner inline-block hover:scale-[1.03] transition-transform duration-300">
              <img src="/logo.png" alt="HomMed Logo" className="h-8 w-auto object-contain" />
            </Link>
            <div>
              <span className="font-accent font-extrabold text-xl tracking-tight text-white">HOMMED</span>
              <p className="text-[10px] text-brand-cyan uppercase tracking-widest font-bold">CRM Panel v1.2</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'analytics' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4.5 w-4.5" />
              <span>Metrics & Analytics</span>
            </button>

            <button 
              onClick={() => setActiveTab('leads')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'leads' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-4.5 w-4.5" />
                <span>Leads Kanban Board</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {leads.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                activeTab === 'appointments' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4.5 w-4.5" />
                <span>Appointments</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {appointments.filter(a => a.status === 'Pending').length} pending
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('services')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'services' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="h-4.5 w-4.5" />
              <span>Specializations CMS</span>
            </button>

            <button 
              onClick={() => setActiveTab('blogs')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'blogs' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Medical Blogs CMS</span>
            </button>

            <button 
              onClick={() => setActiveTab('popups')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'popups' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Marketing Popups</span>
            </button>

            <button 
              onClick={() => setActiveTab('staff')}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'staff' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Staff Accounts</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar Info */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-brand-cyan">
              IQ
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Dr. Iqbal</p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full h-10 border border-slate-800 bg-slate-900/50 hover:bg-rose-950/20 hover:border-rose-900 hover:text-rose-400 text-slate-400 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Control</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Floating alerts */}
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

        {/* Top Header Metrics bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'analytics' && 'Operational Analytics & Metrics'}
              {activeTab === 'leads' && 'CRM Kanban Leads Board'}
              {activeTab === 'appointments' && 'Clinic Bookings Manager'}
              {activeTab === 'services' && 'Services CMS Console'}
              {activeTab === 'blogs' && 'Medical Blogs Publication CMS'}
              {activeTab === 'popups' && 'Lead Capture & Promo Popups'}
              {activeTab === 'staff' && 'Clinic Staff Member Accounts'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Welcome back, Dr. Iqbal. Review patient registrations, lead automations, and page triggers.
            </p>
          </div>

          <button 
            onClick={() => loadAllData(localStorage.getItem('hommed_token') || '')}
            className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Database</span>
          </button>
        </div>

        {/* ANALYTICS TAB CONTENT */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total CRM Leads</span>
                  <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Users className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{leads.length}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center mt-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +18% from last week</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Appointments booked</span>
                  <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Calendar className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{appointments.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{appointments.filter(a => a.status === 'Pending').length} pending confirmation</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Specialties Active</span>
                  <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><Layers className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{services.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Managed dynamically on site</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Popup Triggers</span>
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Settings className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">
                    {popups.filter(p => p.isActive).length} / {popups.length}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Active promotional layouts</p>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Pending Appointments Review List */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-lg text-white">Pending Action Bookings</h3>
                  <span className="text-xs text-brand-cyan hover:underline cursor-pointer" onClick={() => setActiveTab('appointments')}>
                    Manage all
                  </span>
                </div>

                {appointments.filter(a => a.status === 'Pending').length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Check className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                    <p className="font-bold">All caught up!</p>
                    <p className="text-xs">No pending appointment review requests.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.filter(a => a.status === 'Pending').map(appt => (
                      <div key={appt._id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-sm text-white">{appt.patientName}</p>
                            <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded font-semibold">{appt.service}</span>
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
                            className="flex-1 sm:flex-none h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Cancelled')}
                            className="flex-1 sm:flex-none h-8 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1"
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

              {/* CRM Leads status summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-white">Leads Funnel Status</h3>
                
                <div className="space-y-3.5">
                  {kanbanColumns.map(col => {
                    const count = leads.filter(l => l.status === col.id).length;
                    const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
                    return (
                      <div key={col.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-300">{col.label}</span>
                          <span className="font-mono text-slate-400 font-bold">{count} leads</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${col.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* LEADS KANBAN BOARD TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Search filter bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                placeholder="Search leads by patient name, phone or inquiry..."
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-brand-blue focus:outline-none"
              />
              <Search className="h-4.5 w-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Kanban Columns Flex Container */}
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scroll-smooth select-none">
              
              {kanbanColumns.map(col => {
                const columnLeads = filteredLeads.filter(l => l.status === col.id);
                return (
                  <div key={col.id} className="bg-slate-950/85 border border-slate-800/80 rounded-2xl p-4 flex flex-col space-y-4 w-72 shrink-0 shadow-xl backdrop-blur-md">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                        <span className="font-bold text-xs text-white uppercase tracking-wider">{col.label}</span>
                      </div>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 flex-grow overflow-y-auto max-h-[55vh] min-h-[150px] pr-1.5 scrollbar-thin">
                      {columnLeads.length === 0 ? (
                        <div className="text-center py-10 text-slate-600 text-xs italic border border-dashed border-slate-900 rounded-xl">
                          No leads here
                        </div>
                      ) : (
                        columnLeads.map(lead => {
                          const cleanPhone = lead.phone.replace(/\D/g, '');
                          const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                            `Hello ${lead.name}, this is HOMMED (Dr. Iqbal's Homeopathy Centre). We received your inquiry: "${lead.inquiry.substring(0, 60)}..."`
                          )}`;
                          
                          return (
                            <div 
                              key={lead._id} 
                              className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3.5 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 group"
                            >
                              {/* Header User info */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-extrabold text-xs text-white group-hover:text-brand-cyan transition-colors">{lead.name}</p>
                                  <span className="text-[9px] text-slate-500 font-medium">
                                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Lead'}
                                  </span>
                                </div>
                                
                                {lead.email && (
                                  <div className="flex items-center space-x-1.5 text-[9px] text-slate-400">
                                    <Mail className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                                    <span className="truncate max-w-[170px]" title={lead.email}>{lead.email}</span>
                                  </div>
                                )}
                              </div>

                              {/* Inquiry content */}
                              {lead.inquiry && (
                                <p className="text-[10px] text-slate-300 font-light leading-relaxed line-clamp-3 bg-slate-950/40 p-2 rounded-lg border border-slate-850/40">
                                  {lead.inquiry}
                                </p>
                              )}

                              {/* Quick Contact Action Buttons */}
                              <div className="flex items-center gap-1.5 pt-1">
                                <a 
                                  href={`tel:${lead.phone}`}
                                  className="flex-1 h-7 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-slate-300 rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all"
                                  title={`Call ${lead.name}`}
                                >
                                  <Phone className="h-3 w-3 text-brand-cyan" />
                                  <span>Call</span>
                                </a>
                                
                                <a 
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 h-7 bg-[#075e54]/20 hover:bg-[#075e54]/40 border border-[#075e54]/40 hover:border-[#075e54] text-[#25d366] rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all"
                                  title="WhatsApp patient"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                              
                              {/* Selector to change column status */}
                              <div className="pt-2.5 border-t border-slate-800/80 flex flex-col space-y-1">
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider font-extrabold">Move Lead</span>
                                <select
                                  value={lead.status}
                                  onChange={e => handleUpdateLeadStatus(lead._id, e.target.value)}
                                  className="w-full bg-slate-950 text-[10px] border border-slate-800/80 p-1.5 rounded-lg font-bold text-slate-300 hover:border-slate-700 focus:border-brand-blue focus:outline-none transition-colors"
                                >
                                  {kanbanColumns.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* APPOINTMENTS MANAGER TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Search filter bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={apptSearch}
                onChange={e => setApptSearch(e.target.value)}
                placeholder="Search appointments by patient name, phone, or service..."
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-brand-blue focus:outline-none"
              />
              <Search className="h-4.5 w-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Appointments table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Specialization</th>
                    <th className="pb-3">Requested Slot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Fee Status</th>
                    <th className="pb-3">Change Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs text-slate-300">
                  {filteredAppts.map(appt => (
                    <tr key={appt._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-sm">{appt.patientName}</p>
                          <p className="text-slate-400">Phone: {appt.patientPhone}</p>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-white">{appt.service}</td>
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white">{appt.scheduleDate}</p>
                          <p className="text-slate-400">{appt.scheduleTime}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          appt.status === 'Confirmed' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-400 border border-rose-900'
                            : appt.status === 'Rescheduled'
                            ? 'bg-amber-950 text-amber-400 border border-amber-900'
                            : appt.status === 'Completed'
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-blue-950 text-blue-400 border border-blue-900'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <select
                          value={appt.paymentStatus}
                          onChange={async (e) => {
                            const val = e.target.value;
                            const token = localStorage.getItem('hommed_token');
                            await fetch('/api/appointments', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ id: appt._id, paymentStatus: val })
                            });
                            setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, paymentStatus: val as any } : a));
                            triggerFeedback('Payment status updated.', 'success');
                          }}
                          className="bg-slate-900 border border-slate-800 p-1 rounded focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Confirmed')}
                            className="p-1.5 bg-emerald-900/40 text-emerald-400 border border-emerald-800/60 rounded hover:bg-emerald-900 hover:text-white transition-all"
                            title="Confirm Booking"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          
                          <button 
                            onClick={() => {
                              setReschedulingId(appt._id);
                              setRescheduleData({ date: appt.scheduleDate, time: appt.scheduleTime });
                            }}
                            className="p-1.5 bg-amber-900/40 text-amber-400 border border-amber-800/60 rounded hover:bg-amber-900 hover:text-white transition-all"
                            title="Reschedule / Change timing"
                          >
                            <Clock className="h-3.5 w-3.5" />
                          </button>

                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Completed')}
                            className="p-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>

                          <button 
                            onClick={() => handleUpdateApptStatus(appt._id, 'Cancelled')}
                            className="p-1.5 bg-rose-900/40 text-rose-400 border border-rose-800/60 rounded hover:bg-rose-900 hover:text-white transition-all"
                            title="Cancel Booking"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Inline Reschedule Dialog */}
                        {reschedulingId === appt._id && (
                          <form onSubmit={(e) => handleRescheduleSubmit(e, appt._id)} className="absolute bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 z-20 mt-1 shadow-2xl">
                            <h5 className="font-bold text-xs text-white">Reschedule Patient</h5>
                            <div className="space-y-2">
                              <input 
                                type="date" 
                                value={rescheduleData.date}
                                onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                className="bg-slate-900 text-xs border border-slate-800 p-1.5 rounded w-full"
                              />
                              <input 
                                type="time" 
                                value={rescheduleData.time}
                                onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                className="bg-slate-900 text-xs border border-slate-800 p-1.5 rounded w-full"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button type="submit" className="h-7 px-3 bg-brand-blue text-white rounded text-[10px] font-bold">Apply</button>
                              <button type="button" onClick={() => setReschedulingId(null)} className="h-7 px-3 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">Cancel</button>
                            </div>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* SERVICES CMS TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Clinic Specializations CMS</h3>
              <button 
                onClick={() => setShowServiceForm(!showServiceForm)}
                className="h-10 px-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add Specialization</span>
              </button>
            </div>

            {/* Add Service Form */}
            {showServiceForm && (
              <form onSubmit={handleCreateService} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-xl">
                <h4 className="font-bold text-sm text-white">Create New Clinic Specialization</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Specialization Title</label>
                    <input 
                      type="text" 
                      required
                      value={serviceForm.title}
                      onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. Skin Disorders"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lucide Icon Identifier</label>
                    <select
                      value={serviceForm.icon}
                      onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Sparkles">Sparkles (Skin)</option>
                      <option value="FlameKindling">FlameKindling (Hair)</option>
                      <option value="Wind">Wind (Respiratory)</option>
                      <option value="Brain">Brain (Migraine/Nervous)</option>
                      <option value="Activity">Activity (Women Health)</option>
                      <option value="Baby">Baby (Pediatric)</option>
                      <option value="Heart">Heart (Digestive)</option>
                      <option value="Shield">Shield (Chronic)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Short Description (Cards view)</label>
                  <input 
                    type="text" 
                    required
                    value={serviceForm.shortDescription}
                    onChange={e => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                    placeholder="Short relief summary..."
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Description (Detail page)</label>
                  <textarea 
                    required
                    rows={4}
                    value={serviceForm.detailedDescription}
                    onChange={e => setServiceForm({ ...serviceForm, detailedDescription: e.target.value })}
                    placeholder="Detailed clinical approach description..."
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Symptoms (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={serviceForm.symptoms}
                      onChange={e => setServiceForm({ ...serviceForm, symptoms: e.target.value })}
                      placeholder="Redness, Itching, Dry spots"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Treatments (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={serviceForm.treatments}
                      onChange={e => setServiceForm({ ...serviceForm, treatments: e.target.value })}
                      placeholder="Constitutional remedy, Tincture dispatch"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button type="submit" className="h-10 px-5 bg-brand-blue text-white rounded-xl text-xs font-semibold">Publish Service</button>
                  <button type="button" onClick={() => setShowServiceForm(false)} className="h-10 px-5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                </div>
              </form>
            )}

            {/* List Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(srv => (
                <div key={srv._id || srv.slug} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-brand-cyan px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                        Icon: {srv.icon}
                      </span>
                      {srv._id && (
                        <button 
                          onClick={() => handleDeleteService(srv._id || '')}
                          className="p-1 bg-rose-950/40 text-rose-400 border border-rose-900 rounded hover:bg-rose-900 hover:text-white transition-all"
                          title="Delete service"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <h4 className="font-bold text-base text-white">{srv.title}</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{srv.shortDescription}</p>
                  </div>

                  <div className="border-t border-slate-850 pt-3 text-[10px] text-slate-500 space-y-1 font-light">
                    <p>Symptoms: <strong className="text-slate-300">{srv.symptoms?.join(', ') || 'None listed'}</strong></p>
                    <p>Treatments: <strong className="text-slate-300">{srv.treatments?.join(', ') || 'None listed'}</strong></p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* BLOGS CMS TAB */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Medical Blogs CMS</h3>
              <button 
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="h-10 px-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add Blog Post</span>
              </button>
            </div>

            {/* Add Blog Form */}
            {showBlogForm && (
              <form onSubmit={handleCreateBlog} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-xl">
                <h4 className="font-bold text-sm text-white">Publish New Medical Blog Post</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Article Title</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.title}
                      onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="e.g. Homeopathic Cure for Eczema"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.category}
                      onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                      placeholder="e.g. Skin Care"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Blog Excerpt (Snippet)</label>
                  <input 
                    type="text" 
                    required
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Short 2 sentence snippet summary..."
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={blogForm.image}
                    onChange={e => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="/blog-placeholder.jpg"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Article Content (HTML allowed)</label>
                  <textarea 
                    required
                    rows={6}
                    value={blogForm.content}
                    onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="<p>Write your detailed blog post content here...</p>"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white font-mono"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button type="submit" className="h-10 px-5 bg-brand-blue text-white rounded-xl text-xs font-semibold">Publish Post</button>
                  <button type="button" onClick={() => setShowBlogForm(false)} className="h-10 px-5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                </div>
              </form>
            )}

            {/* List Blogs */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-hidden">
              <div className="space-y-4">
                {blogs.map(post => (
                  <div key={post._id || post.slug} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-all">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-slate-850 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold font-accent uppercase">{post.category}</span>
                        <span className="text-[10px] text-slate-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1">{post.title}</h4>
                      <p className="text-xs text-slate-400 font-light mt-0.5 line-clamp-1">{post.excerpt}</p>
                    </div>

                    {post._id && (
                      <button 
                        onClick={() => handleDeleteBlog(post._id || '')}
                        className="p-2 bg-rose-950/40 text-rose-400 border border-rose-900 rounded-xl hover:bg-rose-900 hover:text-white transition-all shrink-0"
                        title="Delete article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MARKETING POPUPS TAB */}
        {activeTab === 'popups' && (
          <div className="space-y-6">
            
            <div className="p-4 bg-blue-950/50 border border-blue-900 text-blue-300 rounded-2xl text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-white">
                <ShieldAlert className="h-4.5 w-4.5 text-brand-cyan shrink-0" />
                <span>Popup Conversion Strategy</span>
              </div>
              <p className="font-light leading-relaxed">
                Toggling a marketing popup active will automatically deactivate other active configurations. Exit-intent popups display when users scroll mouse outside viewport boundaries, while delayed popups display after the specified delay timer expires.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popups.map(popup => (
                <div key={popup._id || popup.type} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-blue-950 border border-blue-900 text-brand-cyan px-2.5 py-0.5 rounded-full font-bold uppercase font-accent">
                        Trigger: {popup.type}
                      </span>
                      
                      <button 
                        onClick={() => handleTogglePopup(popup._id, popup.isActive)}
                        className="transition-all"
                        title={popup.isActive ? 'Deactivate Popup' : 'Activate Popup'}
                      >
                        {popup.isActive ? (
                          <ToggleRight className="h-9 w-9 text-brand-cyan" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-slate-600" />
                        )}
                      </button>
                    </div>

                    <h4 className="font-bold text-white text-base">{popup.title}</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{popup.content}</p>
                  </div>

                  <div className="border-t border-slate-850 pt-4 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 font-medium">Delay Period:</span>
                      <p className="font-bold text-white">{popup.delaySeconds} seconds</p>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className={`w-2 h-2 rounded-full ${popup.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                      <span className={popup.isActive ? 'text-emerald-400' : 'text-slate-500'}>
                        {popup.isActive ? 'Active on site' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* CLINIC STAFF MEMBER ACCOUNTS TAB */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Active Clinical Staff List</h3>
              <button 
                onClick={() => setShowStaffForm(!showStaffForm)}
                className="h-10 px-4 bg-brand-blue hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            {showStaffForm && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!staffForm.name || !staffForm.email) return;
                  const newStaff = {
                    id: `st-${Date.now()}`,
                    name: staffForm.name,
                    email: staffForm.email,
                    phone: staffForm.phone,
                    role: 'staff',
                    status: 'Active'
                  };
                  setStaffList(prev => [...prev, newStaff]);
                  setStaffForm({ name: '', email: '', phone: '', password: '' });
                  setShowStaffForm(false);
                  triggerFeedback('Staff credentials created successfully.', 'success');
                }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4"
              >
                <h4 className="font-bold text-sm text-white">Create New Clinic Staff Account</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input 
                    type="text" required placeholder="Staff Full Name"
                    value={staffForm.name}
                    onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                    className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                  <input 
                    type="email" required placeholder="staff.name@hommed.com"
                    value={staffForm.email}
                    onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                    className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                  <input 
                    type="text" placeholder="Mobile Number"
                    value={staffForm.phone}
                    onChange={e => setStaffForm({...staffForm, phone: e.target.value})}
                    className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                  <input 
                    type="password" required placeholder="Access Password"
                    value={staffForm.password}
                    onChange={e => setStaffForm({...staffForm, password: e.target.value})}
                    className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <button type="submit" className="h-9 px-4 bg-brand-blue text-white font-bold rounded-lg text-xs">Save Account</button>
              </form>
            )}

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">System Role</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs text-slate-300">
                  {staffList.map(st => (
                    <tr key={st.id}>
                      <td className="py-4 font-bold text-white">{st.name}</td>
                      <td className="py-4">{st.email}</td>
                      <td className="py-4">{st.phone}</td>
                      <td className="py-4"><span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded font-semibold text-[10px]">CLINIC STAFF</span></td>
                      <td className="py-4">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

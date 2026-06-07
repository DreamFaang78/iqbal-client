'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Calendar, Clock, Layers, FileText,
  Settings, LogOut, Plus, Trash2, 
  ToggleLeft, ToggleRight, Check, X, RefreshCw,
  Search, ShieldAlert, ArrowUpRight, BarChart3,
  CheckCircle2, Phone, Mail, MessageSquare,
  Download, Filter, AlertCircle, ChevronDown, ShoppingBag, Package
} from 'lucide-react';

interface LeadData {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  inquiry: string;
  status: string;
  followUpDate?: string;
  followUpScheduled?: string;
  leadSource?: string;
  notes?: string;
  isDuplicate?: boolean;
  assignedTo?: string;
  age?: number;
  gender?: string;
  city?: string;
  createdAt: string;
}

interface AppointmentData {
  _id: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  service: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid';
  appointmentType?: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  patientCity?: string;
  disease?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
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

function normalizeLocation(type?: string): string {
  if (!type) return 'Jajmau Clinic';
  if (type === 'Clinic 1') return 'Jajmau Clinic';
  if (type === 'Clinic 2') return 'Civil Lines Clinic';
  if (type === 'Online') return 'Online Consultation';
  return type;
}

function getLeadLocation(lead: LeadData): 'Online' | 'Civil Lines' | 'Jajmau' {
  const source = (lead.leadSource || '').toLowerCase();
  if (source.includes('civil') || source.includes('lines')) return 'Civil Lines';
  if (source.includes('jajmau')) return 'Jajmau';
  if (source.includes('online')) return 'Online';

  // Parse from inquiry text
  const inquiry = (lead.inquiry || '').toLowerCase();
  if (inquiry.includes('civil lines') || inquiry.includes('civil_lines')) return 'Civil Lines';
  if (inquiry.includes('jajmau')) return 'Jajmau';
  if (inquiry.includes('online')) return 'Online';

  // Parse from city
  const city = (lead.city || '').toLowerCase();
  if (city.includes('civil lines') || city.includes('civil_lines')) return 'Civil Lines';
  if (city.includes('jajmau')) return 'Jajmau';

  return 'Online';
}

function parseInquiryDateTime(inquiry?: string): { displayDate: string; displayTime: string } | null {
  if (!inquiry) return null;
  const onIndex = inquiry.indexOf(' on ');
  const atIndex = inquiry.indexOf(' @ ');
  if (onIndex !== -1 && atIndex !== -1) {
    const dateStr = inquiry.substring(onIndex + 4, atIndex).trim();
    let timeStr = inquiry.substring(atIndex + 3).trim();
    if (timeStr.includes('-')) {
      timeStr = timeStr.split('-')[0].trim();
    }
    
    let displayDate = dateStr;
    try {
      const d = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      if (d.toDateString() === today.toDateString()) {
        displayDate = 'Today';
      } else if (d.toDateString() === tomorrow.toDateString()) {
        displayDate = 'Tomorrow';
      } else {
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (e) {}
    
    return { displayDate, displayTime: timeStr };
  }
  return null;
}

function parseSpecialization(inquiry?: string): string {
  if (!inquiry) return 'General Consultation';
  const problemIndex = inquiry.indexOf('Problem:');
  if (problemIndex !== -1) {
    return inquiry.substring(problemIndex + 8).split('.')[0].split('Requested:')[0].trim();
  }
  const forIndex = inquiry.indexOf('for:');
  if (forIndex !== -1) {
    return inquiry.substring(forIndex + 4).split('on')[0].trim();
  }
  
  const text = inquiry.toLowerCase();
  if (text.includes('skin') || text.includes('eczema') || text.includes('dermatitis')) return 'Skin Disorders';
  if (text.includes('hair') || text.includes('alopecia') || text.includes('fall')) return 'Hair Fall & Alopecia';
  if (text.includes('allergy') || text.includes('asthma') || text.includes('breath')) return 'Allergy & Asthma';
  if (text.includes('digestive') || text.includes('stomach') || text.includes('gas') || text.includes('acidity')) return 'Digestive Issues';
  if (text.includes('thyroid')) return 'Thyroid';
  if (text.includes('sexual') || text.includes('sex') || text.includes('erectile')) return 'Sexual Problem';
  return 'Homeopathic Inquiry';
}

function getLeadTimeInfo(lead: LeadData) {
  const parsed = parseInquiryDateTime(lead.inquiry);
  if (parsed) {
    return {
      timeLabel: `${parsed.displayDate}, ${parsed.displayTime}`,
      bookedLabel: `Date Booked: ${lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}`
    };
  }
  
  const createdDate = lead.createdAt ? new Date(lead.createdAt) : new Date();
  const displayDate = createdDate.toDateString() === new Date().toDateString() ? 'Today' : createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayTime = createdDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
  
  return {
    timeLabel: `${displayDate}, ${displayTime}`,
    bookedLabel: `Date Booked: ${displayDate}`
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'appointments' | 'services' | 'blogs' | 'popups' | 'staff'>('analytics');
  
  // Sub-tab for leads: 'general' vs 'popup'
  const [leadsSubTab, setLeadsSubTab] = useState<'general' | 'popup'>('general');

  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Datasets
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [popups, setPopups] = useState<PopupData[]>([]);

  // Search & Filters
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadLocationFilter, setLeadLocationFilter] = useState('All');
  
  // Appointment filters
  const [apptSearch, setApptSearch] = useState('');
  const [apptTypeFilter, setApptTypeFilter] = useState('All');
  const [apptStatusFilter, setApptStatusFilter] = useState('All');
  const [apptDateFrom, setApptDateFrom] = useState('');
  const [apptDateTo, setApptDateTo] = useState('');

  // Honest data-load error state
  const [leadsError, setLeadsError] = useState<string | null>(null);

  // Temporary notes editor states key-ed by ID
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

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

  // Add Lead Modal state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    city: '',
    problem: 'Skin Disorders',
    location: 'Online',
    status: 'New',
    notes: ''
  });

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

    let parsedUser: any;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('hommed_user');
      router.push('/login');
      return;
    }

    if (parsedUser.role === 'patient') {
      router.push('/dashboard');
      return;
    }

    setAdminUser(parsedUser);
    loadAllData(token);
  }, []);

  const loadAllData = async (token: string) => {
    try {
      setLoading(true);
      setLeadsError(null);
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load leads
      const leadsRes = await fetch('/api/leads', { headers });
      if (leadsRes.ok) {
        setLeads(await leadsRes.json());
      } else {
        const body = await leadsRes.json().catch(() => ({}));
        if (leadsRes.status === 401 || leadsRes.status === 403) {
          setLeadsError('Your admin session has expired or is not authorized. Please sign out and log in again.');
        } else {
          setLeadsError(body.message || `Could not load leads (error ${leadsRes.status}).`);
        }
      }

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

      // Load staff accounts
      await loadStaff(token);

    } catch (err) {
      triggerFeedback('Error communicating with database API, loaded local parameters.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async (token: string) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const res = await fetch('/api/admin/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      setStaffList(await res.json());
    } catch (err: any) {
      setStaffList([]);
      setStaffError(err.message || 'Unable to load staff accounts.');
    } finally {
      setStaffLoading(false);
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

  // Status Normalizer for Leads Kanban
  const normalizeLeadStatus = (status: string): string => {
    if (status === 'New Lead') return 'New';
    if (status === 'Contacted') return 'Called';
    if (status === 'Consultation Scheduled') return 'Appointment Fixed';
    if (status === 'Follow-Up Required' || status === 'Follow-Up') return 'Follow Up';
    if (status === 'Converted') return 'Patient Confirmed';
    if (status === 'Closed') return 'Closed';
    return status;
  };

  const mapVisualToDbStatus = (status: string): string => {
    if (status === 'New') return 'New Lead';
    if (status === 'Called') return 'Contacted';
    if (status === 'Appointment Fixed') return 'Consultation Scheduled';
    if (status === 'Follow Up') return 'Follow-Up Required';
    if (status === 'Patient Confirmed') return 'Converted';
    if (status === 'Closed') return 'Closed';
    return status;
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
        triggerFeedback(`Could not update appointment status.`, 'error');
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
        triggerFeedback('Could not reschedule appointment.', 'error');
      }
      setReschedulingId(null);
    } catch (err) {
      triggerFeedback('Reschedule request failed.', 'error');
    }
  };

  // Lead Status Updates
  const handleUpdateLeadStatus = async (id: string, newVisualStatus: string) => {
    try {
      const dbStatus = mapVisualToDbStatus(newVisualStatus);
      const token = localStorage.getItem('hommed_token');
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: dbStatus })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: dbStatus } : l));
        triggerFeedback(`Lead moved to ${newVisualStatus}.`, 'success');
      } else {
        triggerFeedback(`Could not update lead status.`, 'error');
      }
    } catch (e) {
      triggerFeedback('Failed to update lead status.', 'error');
    }
  };

  // Lead Location Updates
  const handleUpdateLeadLocation = async (id: string, newLocation: string) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const lead = leads.find(l => l._id === id);
      if (!lead) return;

      const sourcePrefix = (lead.leadSource || 'contact').split(':')[0];
      const updatedSource = `${sourcePrefix}:${newLocation}`;

      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, leadSource: updatedSource })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l._id === id ? { ...l, leadSource: updatedSource } : l));
        triggerFeedback(`Lead location updated to ${newLocation}.`, 'success');
      } else {
        triggerFeedback(`Could not update lead location.`, 'error');
      }
    } catch (e) {
      triggerFeedback('Failed to update lead location.', 'error');
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLeadForm.name || !addLeadForm.phone) {
      triggerFeedback('Name and phone are required.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('hommed_token');
      const inquiryText = `Problem: ${addLeadForm.problem}.`;
      const leadSource = `contact:${addLeadForm.location}`;

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: addLeadForm.name,
          phone: addLeadForm.phone,
          email: addLeadForm.email || null,
          inquiry: inquiryText,
          leadSource: leadSource,
          age: addLeadForm.age ? parseInt(addLeadForm.age) : null,
          gender: addLeadForm.gender || null,
          city: addLeadForm.city || null,
          notes: addLeadForm.notes || null,
          status: addLeadForm.status
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          setLeads(prev => [data.lead, ...prev]);
        }
        triggerFeedback('New lead created successfully!', 'success');
        setShowAddLeadModal(false);
        setAddLeadForm({
          name: '',
          phone: '',
          email: '',
          age: '',
          gender: '',
          city: '',
          problem: 'Skin Disorders',
          location: 'Online',
          status: 'New',
          notes: ''
        });
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || 'Could not create lead.', 'error');
      }
    } catch (err) {
      triggerFeedback('Request failed to create lead.', 'error');
    }
  };

  // Save notes handler
  const handleSaveNotes = async (id: string, notes: string, isLead: boolean) => {
    try {
      const token = localStorage.getItem('hommed_token');
      const url = isLead ? '/api/leads' : '/api/appointments';
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, notes })
      });

      if (res.ok) {
        if (isLead) {
          setLeads(prev => prev.map(l => l._id === id ? { ...l, notes } : l));
        } else {
          setAppointments(prev => prev.map(a => a._id === id ? { ...a, notes } : a));
        }
        triggerFeedback('Notes saved successfully.', 'success');
      } else {
        triggerFeedback('Failed to save notes.', 'error');
      }
    } catch (err) {
      triggerFeedback('Error saving notes.', 'error');
    }
  };

  // Delete lead handler
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const token = localStorage.getItem('hommed_token');
      const res = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l._id !== id));
        triggerFeedback('Lead permanently deleted.', 'success');
      } else {
        triggerFeedback('Failed to delete lead.', 'error');
      }
    } catch (err) {
      triggerFeedback('Error deleting lead.', 'error');
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
        // Reload popups list since activating one will deactivate other popups
        const popupsRes = await fetch('/api/popups');
        if (popupsRes.ok) setPopups(await popupsRes.json());
        triggerFeedback('Popup banner toggled successfully.', 'success');
      } else {
        triggerFeedback('Could not update popup status.', 'error');
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
        triggerFeedback('Could not add service.', 'error');
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
        triggerFeedback('Could not delete service.', 'error');
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
        triggerFeedback('Could not publish article.', 'error');
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
        triggerFeedback('Could not delete article.', 'error');
      }
    } catch (err) {
      triggerFeedback('Error deleting blog post.', 'error');
    }
  };

  // CSV Export functions
  const exportLeadsCSV = (data: LeadData[]) => {
    const headers = ['Name', 'Phone', 'Email', 'Source', 'Status', 'Age', 'Gender', 'City', 'Notes', 'Follow-up Scheduled', 'Created At'];
    const rows = data.map(l => [
      l.name,
      l.phone,
      l.email || '',
      l.leadSource || 'contact',
      normalizeLeadStatus(l.status),
      l.age || '',
      l.gender || '',
      l.city || '',
      l.notes || '',
      l.followUpScheduled || '',
      l.createdAt
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hommed_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const exportApptsCSV = (data: AppointmentData[]) => {
    const headers = ['Patient Name', 'Phone', 'Email', 'Type', 'Service', 'Date', 'Time', 'Status', 'Payment', 'Age', 'Gender', 'City', 'Disease', 'Notes', 'Created At'];
    const rows = data.map(a => [
      a.patientName,
      a.patientPhone,
      a.patientEmail || '',
      normalizeLocation(a.appointmentType),
      a.service,
      a.scheduleDate,
      a.scheduleTime,
      a.status,
      a.paymentStatus,
      a.patientAge || '',
      a.patientGender || '',
      a.patientCity || '',
      a.disease || '',
      a.notes || '',
      a.createdAt
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hommed_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
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

  // Filter Leads
  const filteredLeads = leads.filter(l => {
    // Tab filtering
    const isPopupLead = l.leadSource && l.leadSource.startsWith('popup');
    if (leadsSubTab === 'popup' && !isPopupLead) return false;
    if (leadsSubTab === 'general' && isPopupLead) return false;

    // Location filtering
    const loc = getLeadLocation(l);
    if (leadLocationFilter !== 'All' && loc !== leadLocationFilter) return false;

    // Search query filtering
    const searchMatch = 
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
      l.phone.includes(leadSearch) ||
      (l.inquiry && l.inquiry.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.city && l.city.toLowerCase().includes(leadSearch.toLowerCase()));

    // Status filtering
    const normalizedStatus = normalizeLeadStatus(l.status);
    const statusMatch = leadStatusFilter === 'All' || normalizedStatus === leadStatusFilter;

    return searchMatch && statusMatch;
  });

  // Filter Appointments
  const filteredAppts = appointments.filter(a => {
    // Search query
    const searchMatch = 
      a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) || 
      a.patientPhone.includes(apptSearch) || 
      a.service.toLowerCase().includes(apptSearch.toLowerCase()) ||
      (a.patientEmail && a.patientEmail.toLowerCase().includes(apptSearch.toLowerCase())) ||
      (a.patientCity && a.patientCity.toLowerCase().includes(apptSearch.toLowerCase())) ||
      (a.disease && a.disease.toLowerCase().includes(apptSearch.toLowerCase()));

    // Clinic Type filter
    const apptType = normalizeLocation(a.appointmentType);
    const typeMatch = apptTypeFilter === 'All' || apptType === apptTypeFilter;

    // Status filter
    const statusMatch = apptStatusFilter === 'All' || a.status === apptStatusFilter;

    // Date range filter
    let dateMatch = true;
    if (apptDateFrom && a.scheduleDate < apptDateFrom) dateMatch = false;
    if (apptDateTo && a.scheduleDate > apptDateTo) dateMatch = false;

    return searchMatch && typeMatch && statusMatch && dateMatch;
  });

  // Kanban columns configuration
  const kanbanColumns = [
    { id: 'New', label: 'New', color: 'bg-blue-500', icon: '📄' },
    { id: 'Called', label: 'Called', color: 'bg-cyan-500', icon: '✅' },
    { id: 'Appointment Fixed', label: 'Appointment Fixed', color: 'bg-indigo-500', icon: '' },
    { id: 'Follow Up', label: 'Follow Up', color: 'bg-amber-500', icon: '' },
    { id: 'Patient Confirmed', label: 'Patient Confirmed', color: 'bg-emerald-500', icon: '✅' },
    { id: 'Closed', label: 'Closed', color: 'bg-slate-400', icon: '' }
  ];

  // Statistics calculation
  const totalLeadsCount = leads.length;
  const popupLeadsCount = leads.filter(l => l.leadSource && l.leadSource.startsWith('popup')).length;
  const totalApptsCount = appointments.length;

  // Today activity metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const apptsToday = appointments.filter(a => a.scheduleDate === todayStr);
  const leadsToday = leads.filter(l => l.createdAt && l.createdAt.startsWith(todayStr));

  // Today's appointments count and next appointment info for top banner
  const getTodayAppointmentsInfo = () => {
    const todayAppts = appointments.filter(a => a.scheduleDate === todayStr && a.status !== 'Cancelled');
    if (todayAppts.length === 0) {
      return { count: 0, text: 'No appointments left today' };
    }
    
    // Sort todayAppts by time
    const sorted = [...todayAppts].sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));
    
    // Simple heuristic: find the first confirmed/pending one or just the first one of the day
    const nextAppt = sorted.find(a => a.status === 'Confirmed' || a.status === 'Pending') || sorted[0];
    
    return {
      count: todayAppts.length,
      text: nextAppt ? `Next: ${nextAppt.patientName} @ ${nextAppt.scheduleTime}` : 'No more appointments today'
    };
  };

  const todayInfo = getTodayAppointmentsInfo();

  // Clinic Distribution metrics
  const jajmauCount = appointments.filter(a => normalizeLocation(a.appointmentType) === 'Jajmau Clinic').length;
  const civilLinesCount = appointments.filter(a => normalizeLocation(a.appointmentType) === 'Civil Lines Clinic').length;
  const onlineCount = appointments.filter(a => normalizeLocation(a.appointmentType) === 'Online Consultation').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Banner (mockup look) */}
      <div className="w-full bg-[#0d9488] text-white py-2.5 px-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold select-none border-b border-teal-700/30">
        <div className="flex items-center space-x-3">
          <span className="bg-[#0a6057] px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
            Today's Appointments
          </span>
          <span className="text-teal-100 font-bold">
            Appointments Today: <strong className="text-white font-mono text-sm">{todayInfo.count}</strong>
          </span>
        </div>
        <div className="h-4 w-px bg-teal-600 hidden md:block"></div>
        <div className="text-teal-50 font-medium">
          {todayInfo.text}
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="bg-white p-1.5 rounded-xl shadow-inner inline-block hover:scale-[1.03] transition-transform duration-300">
              <Image src="/logo.png" alt="HomMed Logo" width={32} height={32} className="h-8 w-auto object-contain" />
            </Link>
            <div>
              <span className="font-accent font-extrabold text-xl tracking-tight text-white">HOMMED</span>
              <p className="text-[10px] text-brand-cyan uppercase tracking-widest font-bold">CRM Panel v2.0</p>
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

            <div className="pt-2 pb-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2">E-Commerce</div>
              
              <Link 
                href="/admin/products"
                className="w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Products CMS</span>
              </Link>
              
              <Link 
                href="/admin/orders"
                className="w-full h-11 px-4 rounded-xl text-sm font-semibold flex items-center space-x-3 transition-all text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <Package className="h-4.5 w-4.5" />
                <span>Orders Manager</span>
              </Link>
            </div>
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
      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto max-h-screen relative">
        <div className="absolute inset-0 bg-center bg-no-repeat opacity-[0.025] pointer-events-none" style={{ backgroundImage: "url('/logo.png')", backgroundSize: '400px auto' }}></div>
        
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
          <div className="flex items-center space-x-3.5">
            {activeTab === 'leads' && (
              <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-200 shrink-0 select-none">
                <Image src="/logo.png" alt="HomMed Logo" width={40} height={40} className="h-10 w-auto object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeTab === 'analytics' && 'Operational Analytics & Metrics'}
                {activeTab === 'leads' && "Dr. Iqbal's Homoeopathic Centre"}
                {activeTab === 'appointments' && 'Clinic Bookings Manager'}
                {activeTab === 'services' && 'Services CMS Console'}
                {activeTab === 'blogs' && 'Medical Blogs Publication CMS'}
                {activeTab === 'popups' && 'Lead Capture & Promo Popups'}
                {activeTab === 'staff' && 'Clinic Staff Member Accounts'}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                {activeTab === 'leads' ? 'Review patient registrations, lead automations, and page triggers.' : 'Welcome back, Dr. Iqbal. Review patient registrations, lead automations, and page triggers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === 'leads' && (
              <button 
                onClick={() => setShowAddLeadModal(true)}
                className="h-10 px-4 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-teal-905/20"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Lead</span>
              </button>
            )}
            <button 
              onClick={() => loadAllData(localStorage.getItem('hommed_token') || '')}
              className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync Database</span>
            </button>
          </div>
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
                  <p className="text-3xl font-extrabold text-white">{totalLeadsCount}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{popupLeadsCount} captured via popup trigger</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Appointments booked</span>
                  <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Calendar className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{totalApptsCount}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{appointments.filter(a => a.status === 'Pending').length} pending confirmation</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today's Activity</span>
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Clock className="h-5 w-5" /></span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">
                    {apptsToday.length + leadsToday.length}
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1">+{apptsToday.length} Appts | +{leadsToday.length} Leads today</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Popup Triggers</span>
                  <span className="p-2 bg-[#ff7a00]/10 text-[#ff7a00] rounded-lg"><Settings className="h-5 w-5" /></span>
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
                            <span className="text-[9px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{normalizeLocation(appt.appointmentType)}</span>
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

              {/* CRM Leads & Clinic Distribution status summary */}
              <div className="space-y-6">
                
                {/* Clinic Distribution */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-white">Clinic Distribution</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Jajmau Clinic:</span>
                      <strong className="text-white font-mono text-sm">{jajmauCount} bookings</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Civil Lines Clinic:</span>
                      <strong className="text-white font-mono text-sm">{civilLinesCount} bookings</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Online Consultations:</span>
                      <strong className="text-white font-mono text-sm">{onlineCount} bookings</strong>
                    </div>
                  </div>
                </div>

                {/* CRM Leads Funnel */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-white">Leads Location Distribution</h3>
                  
                  <div className="space-y-3.5">
                    {kanbanColumns.map(col => {
                      const count = leads.filter(l => getLeadLocation(l) === col.id).length;
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

          </div>
        )}

        {/* LEADS KANBAN BOARD TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">

            {/* Honest error banner */}
            {leadsError && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 text-sm">
                  <p className="font-bold text-rose-100">Could not load leads</p>
                  <p className="text-rose-300/90 mt-0.5">{leadsError}</p>
                </div>
                <button
                  onClick={() => loadAllData(localStorage.getItem('hommed_token') || '')}
                  className="h-9 px-3 bg-rose-900/60 hover:bg-rose-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Search, filters, tabs and CSV Export row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Sub-tab selection */}
              <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setLeadsSubTab('general')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    leadsSubTab === 'general' ? 'bg-[#0d9488] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  General CRM Leads
                </button>
                <button
                  onClick={() => setLeadsSubTab('popup')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    leadsSubTab === 'popup' ? 'bg-[#0d9488] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Popup Leads ({leads.filter(l => l.leadSource && l.leadSource.startsWith('popup')).length})
                </button>
              </div>

              {/* Action and filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-grow lg:w-96">
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={e => setLeadSearch(e.target.value)}
                    placeholder="Search leads by patient name, phone or inquiry..."
                    className="w-full h-10 pl-10 pr-4 bg-[#131b2e] border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-none placeholder:text-slate-500 transition-all shadow-lg"
                  />
                  <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={leadLocationFilter}
                  onChange={e => setLeadLocationFilter(e.target.value)}
                  className="h-10 px-3 bg-[#131b2e] text-xs border border-slate-800 rounded-xl text-slate-350 focus:outline-none focus:border-teal-500 cursor-pointer shadow-lg font-semibold text-slate-300"
                >
                  <option value="All">All Locations</option>
                  <option value="Online">Online Consultations</option>
                  <option value="Civil Lines">Civil Lines Clinic</option>
                  <option value="Jajmau">Jajmau Clinic</option>
                </select>

                <button
                  onClick={() => exportLeadsCSV(filteredLeads)}
                  className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg border border-slate-700/80"
                  title="Export current filtered list to CSV file"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Kanban Columns Flex Container */}
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scroll-smooth select-none">
              
              {kanbanColumns.map(col => {
                const columnLeads = filteredLeads.filter(l => normalizeLeadStatus(l.status) === col.id);
                return (
                  <div key={col.id} className="bg-[#121c2c]/90 border border-slate-800/80 rounded-[20px] p-4 flex flex-col space-y-4 w-72 shrink-0 shadow-2xl backdrop-blur-md">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white uppercase tracking-wider">{col.label}</span>
                        {col.icon && <span className="text-sm bg-slate-800/40 p-0.5 rounded leading-none">{col.icon}</span>}
                      </div>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="space-y-3.5 flex-grow overflow-y-auto max-h-[55vh] min-h-[150px] pr-1.5 scrollbar-thin">
                      {columnLeads.length === 0 ? (
                        <div className="text-center py-10 text-slate-600 text-xs italic border border-dashed border-slate-900/60 rounded-xl">
                          No leads here
                        </div>
                      ) : (
                        columnLeads.map(lead => {
                          const cleanPhone = lead.phone.replace(/\D/g, '');
                          const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                            `Hello ${lead.name}, this is HOMMED (Dr. Iqbal's Homeopathy Centre). We received your inquiry: "${lead.inquiry.substring(0, 60)}..."`
                          )}`;
                          
                          const notesVal = editingNotes[lead._id] !== undefined ? editingNotes[lead._id] : (lead.notes || '');
                          const timeInfo = getLeadTimeInfo(lead);
                          const specialization = parseSpecialization(lead.inquiry);
                          const locationVal = getLeadLocation(lead);

                          return (
                            <div 
                              key={lead._id} 
                              className={`p-4 bg-white border border-slate-100 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 space-y-4 relative ${
                                lead.isDuplicate ? 'ring-2 ring-amber-500/30' : ''
                              }`}
                            >
                              
                              {/* Duplicate Warning */}
                              {lead.isDuplicate && (
                                <div className="px-2 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[9px] font-bold flex items-center space-x-1.5 animate-pulse">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                                  <span>Duplicate lead detected</span>
                                </div>
                              )}

                              {/* Header: Name and Specialization Pill */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-0.5 min-w-0">
                                  <p className="font-extrabold text-xs text-slate-900 tracking-tight leading-tight truncate">{lead.name}</p>
                                  {lead.phone && <p className="text-[10px] text-slate-500 font-semibold select-all tracking-normal">{lead.phone}</p>}
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">
                                  {specialization}
                                </span>
                              </div>

                              {/* Date and Time info with Red dot */}
                              <div className="flex flex-col space-y-0.5 text-[10px] text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3.5 w-3.5 text-slate-400 mr-0.5 shrink-0" />
                                  <span className="font-bold text-slate-700">{timeInfo.timeLabel}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block ml-1 animate-pulse shrink-0"></span>
                                </div>
                                <div className="text-[9px] font-medium text-slate-400 pl-5">
                                  {timeInfo.bookedLabel}
                                </div>
                              </div>

                              {/* City & Location Tags */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9px]">
                                {lead.city && (
                                  <span className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded-lg font-medium border border-slate-200/50">
                                    {lead.city}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${
                                  locationVal === 'Online' ? 'bg-sky-50 text-sky-700 border-sky-200/40' :
                                  locationVal === 'Civil Lines' ? 'bg-amber-50 text-amber-700 border-amber-200/40' :
                                  'bg-emerald-50 text-emerald-700 border-emerald-200/40'
                                }`}>
                                  {locationVal}
                                </span>
                              </div>

                              {/* Inquiry text (Collapsible or truncated) */}
                              {lead.inquiry && !lead.inquiry.startsWith('Auto-generated') && (
                                <p className="text-[10px] text-slate-650 font-light leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/80">
                                  {lead.inquiry}
                                </p>
                              )}

                              {/* Notes area */}
                              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[8px]">CRM Staff Notes</span>
                                  {editingNotes[lead._id] !== undefined && (
                                    <button 
                                      onClick={() => {
                                        handleSaveNotes(lead._id, notesVal, true);
                                        const next = { ...editingNotes };
                                        delete next[lead._id];
                                        setEditingNotes(next);
                                      }}
                                      className="bg-brand-blue hover:bg-brand-blue/90 text-white px-2 py-0.5 rounded-md font-bold transition-all text-[8px]"
                                    >
                                      Save
                                    </button>
                                  )}
                                </div>
                                <textarea
                                  value={notesVal}
                                  onChange={e => setEditingNotes({ ...editingNotes, [lead._id]: e.target.value })}
                                  placeholder="Type notes..."
                                  className="w-full bg-slate-50 text-[9px] border border-slate-100 focus:border-slate-200 p-2 rounded-xl font-light text-slate-900 focus:outline-none min-h-[35px] max-h-[100px] resize-y"
                                />
                              </div>

                              {/* Stacked Actions (WhatsApp & Call) */}
                              <div className="flex flex-col space-y-2 pt-1 border-t border-slate-100">
                                <a 
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-10 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                                >
                                  <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.43 1.453 5.478 0 9.932-4.437 9.935-9.885.002-2.638-1.02-5.12-2.877-6.98-1.856-1.859-4.325-2.883-6.963-2.883-5.485 0-9.94 4.437-9.943 9.886-.002 1.958.513 3.868 1.492 5.578l-.979 3.578 3.666-.962zm9.749-3.816c-.265-.133-1.57-.775-1.813-.863-.243-.088-.419-.133-.596.133-.176.265-.685.863-.839 1.04-.155.176-.309.199-.575.066-.265-.133-1.12-.413-2.133-1.317-.788-.703-1.32-1.57-1.475-1.835-.155-.265-.017-.409.116-.541.12-.119.265-.309.398-.464.133-.155.177-.265.265-.442.088-.177.044-.331-.022-.464-.066-.133-.596-1.436-.816-1.966-.215-.518-.432-.447-.597-.456-.155-.008-.331-.01-.507-.01-.176 0-.464.066-.707.309-.243.243-.927.905-.927 2.206 0 1.302.946 2.562 1.077 2.739.133.177 1.86 2.84 4.505 3.987.63.272 1.122.434 1.507.557.633.201 1.21.172 1.666.105.507-.074 1.57-.641 1.79-1.259.222-.619.222-1.149.155-1.259-.066-.109-.243-.176-.507-.309z"/>
                                  </svg>
                                  <span>WhatsApp</span>
                                </a>
                                <a 
                                  href={`tel:${lead.phone}`}
                                  className="h-10 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                                >
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  <span>Call</span>
                                </a>
                              </div>

                              {/* Stacked Dropdown Update Stage & Delete Row */}
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <div className="relative flex-grow">
                                  <select
                                    value={normalizeLeadStatus(lead.status)}
                                    onChange={e => handleUpdateLeadStatus(lead._id, e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 pl-3 pr-8 rounded-xl appearance-none cursor-pointer focus:outline-none transition-colors text-center"
                                  >
                                    <option value="" disabled hidden>Update Stage</option>
                                    <option value="New">New</option>
                                    <option value="Called">Called</option>
                                    <option value="Appointment Fixed">Appointment Fixed</option>
                                    <option value="Follow Up">Follow Up</option>
                                    <option value="Patient Confirmed">Patient Confirmed</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteLead(lead._id)}
                                  className="hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-500 transition-colors p-2.5 rounded-xl shrink-0"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
            
            {/* Search and Filters panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
              
              <div className="flex items-center space-x-2 border-b border-slate-850 pb-2">
                <Filter className="w-4.5 h-4.5 text-brand-cyan" />
                <h4 className="font-bold text-sm text-white">Filter & Search Bookings</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                
                {/* Search query */}
                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Search Patients/Diseases</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={apptSearch}
                      onChange={e => setApptSearch(e.target.value)}
                      placeholder="Search patient, phone, city, disease..."
                      className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Clinic Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Clinic Branch/Type</label>
                  <select
                    value={apptTypeFilter}
                    onChange={e => setApptTypeFilter(e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none px-2"
                  >
                    <option value="All">All Appointments</option>
                    <option value="Online Consultation">Online Consultation</option>
                    <option value="Jajmau Clinic">Jajmau Clinic</option>
                    <option value="Civil Lines Clinic">Civil Lines Clinic</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Booking Status</label>
                  <select
                    value={apptStatusFilter}
                    onChange={e => setApptStatusFilter(e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none px-2"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date From */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">From Date</label>
                  <input
                    type="date"
                    value={apptDateFrom}
                    onChange={e => setApptDateFrom(e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none px-2"
                  />
                </div>

                {/* Date To */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">To Date</label>
                  <input
                    type="date"
                    value={apptDateTo}
                    onChange={e => setApptDateTo(e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none px-2"
                  />
                </div>

              </div>

              {/* CSV Export & Clear filters row */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-850/65">
                <span className="text-[10px] text-slate-500 font-semibold">{filteredAppts.length} appointments matched.</span>
                <div className="flex items-center space-x-2">
                  {(apptSearch || apptTypeFilter !== 'All' || apptStatusFilter !== 'All' || apptDateFrom || apptDateTo) && (
                    <button
                      onClick={() => {
                        setApptSearch('');
                        setApptTypeFilter('All');
                        setApptStatusFilter('All');
                        setApptDateFrom('');
                        setApptDateTo('');
                      }}
                      className="h-9 px-3 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => exportApptsCSV(filteredAppts)}
                    className="h-9 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Filtered to CSV</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Appointments table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3">Patient & Demographics</th>
                    <th className="pb-3">Clinic & Service</th>
                    <th className="pb-3">Medical Complaint</th>
                    <th className="pb-3">Requested Slot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Fee Status</th>
                    <th className="pb-3">CRM Staff Notes</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs text-slate-300">
                  {filteredAppts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 italic">
                        No appointments found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppts.map(appt => {
                      const notesVal = editingNotes[appt._id] !== undefined ? editingNotes[appt._id] : (appt.notes || '');
                      const cleanPhone = appt.patientPhone.replace(/\D/g, '');
                      const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                        `Hello ${appt.patientName}, this is HOMMED clinic. Your booking for '${appt.service}' on ${appt.scheduleDate} at ${appt.scheduleTime} has been updated. Please confirm your attendance.`
                      )}`;

                      return (
                        <tr key={appt._id} className="hover:bg-slate-900/50 transition-colors">
                          
                          {/* Patient and demographics */}
                          <td className="py-4">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-sm">{appt.patientName}</p>
                              <p className="text-slate-400">Phone: {appt.patientPhone}</p>
                              {appt.patientEmail && <p className="text-slate-500 text-[10px]">Email: {appt.patientEmail}</p>}
                              {(appt.patientAge || appt.patientGender || appt.patientCity) && (
                                <p className="text-[10px] text-brand-cyan/80 font-medium">
                                  {appt.patientAge ? `${appt.patientAge} yrs` : ''} 
                                  {appt.patientGender ? ` | ${appt.patientGender}` : ''} 
                                  {appt.patientCity ? ` | ${appt.patientCity}` : ''}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Clinic branch and Service */}
                          <td className="py-4 font-semibold text-white">
                            <div className="space-y-1">
                              <span className="inline-block text-[9px] bg-purple-950 text-purple-300 border border-purple-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                {normalizeLocation(appt.appointmentType)}
                              </span>
                              <p className="text-slate-300 font-semibold">{appt.service}</p>
                            </div>
                          </td>

                          {/* Medical Complaint */}
                          <td className="py-4 max-w-[180px]">
                            <p className="text-slate-300 font-light truncate" title={appt.disease || 'No detail provided'}>
                              {appt.disease || '—'}
                            </p>
                          </td>

                          {/* Schedule time */}
                          <td className="py-4">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white">{appt.scheduleDate}</p>
                              <p className="text-slate-400">{appt.scheduleTime}</p>
                            </div>
                          </td>

                          {/* Status */}
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

                          {/* Fee Payment */}
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
                              className="bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-slate-300 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </td>

                          {/* Inline Notes update box */}
                          <td className="py-4 max-w-[200px]">
                            <div className="flex flex-col space-y-1">
                              <textarea
                                value={notesVal}
                                onChange={e => setEditingNotes({ ...editingNotes, [appt._id]: e.target.value })}
                                placeholder="Add appointment notes..."
                                className="w-full bg-slate-900 text-[10px] border border-slate-800 p-1 rounded-lg text-slate-300 focus:outline-none focus:border-slate-600 resize-none min-h-[36px]"
                              />
                              {editingNotes[appt._id] !== undefined && (
                                <button
                                  onClick={() => {
                                    handleSaveNotes(appt._id, notesVal, false);
                                    const next = { ...editingNotes };
                                    delete next[appt._id];
                                    setEditingNotes(next);
                                  }}
                                  className="self-end text-[9px] bg-brand-blue text-white px-2 py-0.5 rounded font-bold"
                                >
                                  Save Notes
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* WhatsApp Contact */}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#075e54]/20 hover:bg-[#075e54]/40 border border-[#075e54]/40 hover:border-[#075e54] text-[#25d366] rounded hover:scale-[1.02] transition-all"
                                title="Contact patient on WhatsApp"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>

                              {/* Phone Call */}
                              <a
                                href={`tel:${appt.patientPhone}`}
                                className="p-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition-all"
                                title={`Call patient ${appt.patientName}`}
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>

                              {/* Confirm status */}
                              <button 
                                onClick={() => handleUpdateApptStatus(appt._id, 'Confirmed')}
                                className="p-1.5 bg-emerald-900/40 text-emerald-400 border border-emerald-800/60 rounded hover:bg-emerald-900 hover:text-white transition-all"
                                title="Confirm Booking"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              
                              {/* Reschedule */}
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

                              {/* Complete */}
                              <button 
                                onClick={() => handleUpdateApptStatus(appt._id, 'Completed')}
                                className="p-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all"
                                title="Mark as Completed"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>

                              {/* Cancel */}
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
                              <form onSubmit={(e) => handleRescheduleSubmit(e, appt._id)} className="absolute right-6 bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 z-25 mt-2 shadow-2xl w-60 text-left">
                                <h5 className="font-bold text-xs text-white">Reschedule Patient</h5>
                                <div className="space-y-2">
                                  <input 
                                    type="date" 
                                    value={rescheduleData.date}
                                    onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                    className="bg-slate-900 text-xs border border-slate-800 p-1.5 rounded w-full text-white"
                                  />
                                  <input 
                                    type="time" 
                                    value={rescheduleData.time}
                                    onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                    className="bg-slate-900 text-xs border border-slate-800 p-1.5 rounded w-full text-white"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button type="submit" className="h-7 px-3 bg-brand-blue text-white rounded text-[10px] font-bold">Apply</button>
                                  <button type="button" onClick={() => setReschedulingId(null)} className="h-7 px-3 bg-slate-850 text-slate-300 rounded text-[10px] font-bold">Cancel</button>
                                </div>
                              </form>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
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
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lucide Icon Identifier</label>
                    <select
                      value={serviceForm.icon}
                      onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-slate-300"
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
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
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
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
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
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Treatments (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={serviceForm.treatments}
                      onChange={e => setServiceForm({ ...serviceForm, treatments: e.target.value })}
                      placeholder="Constitutional remedy, Tincture dispatch"
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs focus:outline-none text-white"
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
                <div key={srv._id || srv.slug} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between font-sans">
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
                        className="transition-all focus:outline-none"
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
                onClick={() => loadStaff(localStorage.getItem('hommed_token') || '')}
                className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh List</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-sans">
              Staff accounts are read live from the <code className="text-brand-cyan">profiles</code> table (role
              <span className="text-slate-300 font-semibold"> staff</span>). To add a staff member, create their
              account via signup and assign the staff role in profiles.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
              {staffLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs">Loading staff accounts...</p>
                </div>
              ) : staffError ? (
                <div className="p-12 text-center text-rose-400">
                  <ShieldAlert className="h-10 w-10 mx-auto mb-2" />
                  <p className="font-bold text-sm">Could not load staff accounts</p>
                  <p className="text-xs text-rose-300/80 mt-1">{staffError}</p>
                  <button
                    onClick={() => loadStaff(localStorage.getItem('hommed_token') || '')}
                    className="mt-4 h-9 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Try again</span>
                  </button>
                </div>
              ) : staffList.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-300">No staff accounts yet</p>
                  <p className="text-xs mt-1">No profiles with the staff role were found.</p>
                </div>
              ) : (
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
                        <td className="py-4 font-bold text-white">{st.name || '—'}</td>
                        <td className="py-4">{st.email || '—'}</td>
                        <td className="py-4">{st.phone || '—'}</td>
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
              )}
            </div>
          </div>
        )}

        {/* ADD LEAD MODAL */}
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="absolute top-4 right-4 hover:bg-slate-800 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all animate-none"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#0d9488]" />
                  <span>Add New Lead Manually</span>
                </h3>
                <p className="text-slate-400 text-xs">
                  Create a new patient lead in the CRM. It will automatically direct to the chosen stage.
                </p>
              </div>

              <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={addLeadForm.name}
                      onChange={e => setAddLeadForm({ ...addLeadForm, name: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Phone Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 9999988888"
                      value={addLeadForm.phone}
                      onChange={e => setAddLeadForm({ ...addLeadForm, phone: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="e.g. name@example.com"
                      value={addLeadForm.email}
                      onChange={e => setAddLeadForm({ ...addLeadForm, email: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">City (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kanpur"
                      value={addLeadForm.city}
                      onChange={e => setAddLeadForm({ ...addLeadForm, city: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Age (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 32"
                      value={addLeadForm.age}
                      onChange={e => setAddLeadForm({ ...addLeadForm, age: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Gender (Optional)</label>
                    <select
                      value={addLeadForm.gender}
                      onChange={e => setAddLeadForm({ ...addLeadForm, gender: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Specialization / Concern</label>
                    <select 
                      value={addLeadForm.problem}
                      onChange={e => setAddLeadForm({ ...addLeadForm, problem: e.target.value })}
                      className="w-full h-10 px-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none cursor-pointer"
                    >
                      <option value="Skin Disorders">Skin Disorders</option>
                      <option value="Hair Fall & Alopecia">Hair Fall & Alopecia</option>
                      <option value="Allergy & Asthma">Allergy & Asthma</option>
                      <option value="Digestive Issues">Digestive Issues</option>
                      <option value="Thyroid">Thyroid</option>
                      <option value="Sexual Problem">Sexual Problem</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Lead Location</label>
                    <select 
                      value={addLeadForm.location}
                      onChange={e => setAddLeadForm({ ...addLeadForm, location: e.target.value })}
                      className="w-full h-10 px-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none cursor-pointer"
                    >
                      <option value="Online">Online</option>
                      <option value="Civil Lines">Civil Lines</option>
                      <option value="Jajmau">Jajmau</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Board Status Stage</label>
                    <select 
                      value={addLeadForm.status}
                      onChange={e => setAddLeadForm({ ...addLeadForm, status: e.target.value })}
                      className="w-full h-10 px-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Called">Called</option>
                      <option value="Appointment Fixed">Appointment Fixed</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Patient Confirmed">Patient Confirmed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Staff Notes / Comments (Optional)</label>
                  <textarea 
                    placeholder="Enter any initial notes here..."
                    value={addLeadForm.notes}
                    onChange={e => setAddLeadForm({ ...addLeadForm, notes: e.target.value })}
                    className="w-full min-h-[60px] p-3 bg-slate-950 border border-slate-800 focus:border-brand-blue rounded-xl text-white outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddLeadModal(false)}
                    className="flex-1 h-11 border border-slate-800 hover:bg-slate-800 text-white rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 h-11 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold transition-all"
                  >
                    Create Lead Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
      </div>
    </div>
  );
}

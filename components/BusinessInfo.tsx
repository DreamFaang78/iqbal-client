import React from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, MessageSquare, Clock, User, Award,
  Stethoscope, CheckCircle2, Building2, CalendarCheck, ArrowRight
} from 'lucide-react';

const BUSINESS_INFO = {
  brandName: 'HOMMED',
  fullName: "HOMMED — Dr. Iqbal's Homoeopathic Centre",
  doctorName: 'Dr. Iqbal Quasim',
  qualification: 'BHMS (Bachelor of Homeopathic Medicine & Surgery)',
  experience: '10+ Years Clinical Experience',
  phone: '+91 87078 68504',
  whatsapp: '918707868504',
  email: 'info@hommed.in',
  website: 'https://www.hommed.org',
  city: 'Kanpur, Uttar Pradesh',
  branches: [
    {
      name: 'Civil Lines Branch',
      address: 'Civil Lines, Kanpur, Uttar Pradesh – 208001',
      hours: 'Mon–Sat: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM',
      mapUrl: 'https://maps.google.com/?q=Civil+Lines+Kanpur',
      tag: 'Main Branch'
    },
    {
      name: 'Jajmau Branch',
      address: 'Jajmau, Kanpur, Uttar Pradesh – 208010',
      hours: 'Mon–Sat: 4:00 PM – 7:00 PM',
      mapUrl: 'https://maps.google.com/?q=Jajmau+Kanpur',
      tag: 'Second Branch'
    }
  ],
  services: [
    'Thyroid (Hypothyroidism / Hyperthyroidism)',
    'PCOS & Hormonal Imbalance',
    'Skin Disorders — Psoriasis, Eczema, Vitiligo',
    'Hair Fall & Alopecia',
    'Diabetes — Integrative Support',
    'Migraine & Chronic Headache',
    'Joint Pain, Arthritis & Gout',
    'Kidney Stone (Pathri) — Without Surgery',
    'Anxiety, Depression & Mental Health',
    'Child Health — Immunity & Tonsils',
    'Pregnancy & Thyroid Support',
    'Chronic Allergies & Asthma',
  ],
  consultationSteps: [
    { step: '1', title: 'Call / WhatsApp Karein', desc: '+91 87078 68504 par seedha call ya WhatsApp message bhejein' },
    { step: '2', title: 'Appointment Fix Karein', desc: 'Civil Lines ya Jajmau branch — ya Online (phone pe) — apni convenience ke hisaab se' },
    { step: '3', title: 'Clinic Mein Milein', desc: 'Dr. Iqbal personally aapka case dekhenge — symptoms, history, reports sab samjhenge' },
    { step: '4', title: 'Personalized Treatment', desc: 'Aapke liye specifically tailored homeopathic medicine — aur regular follow-up' },
  ]
};

export default function BusinessInfo() {
  return (
    <section id="business-info" className="py-24 bg-[#0A1A0D] font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4CAF6E]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C8922A]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* ── SECTION HEADER ── */}
        <div className="text-center space-y-3">
          <span className="text-[#4CAF6E] font-semibold text-xs uppercase tracking-widest">About HOMMED</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Kanpur Ka Sabse Bharoseband<br />
            <span className="text-[#4CAF6E]">Homeopathic Centre</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto font-light">
            Har cheez transparent — doctor, qualification, address, timing — sab kuch yahan.
          </p>
        </div>

        {/* ── DOCTOR PROFILE CARD ── */}
        <div className="bg-gradient-to-br from-[#1C3A22]/70 to-[#132918]/50 border border-[#4CAF6E]/15 rounded-[32px] p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 rounded-full">
              <Award className="h-4 w-4 text-[#C8922A]" />
              <span className="text-[#C8922A] text-xs font-bold uppercase tracking-wider">Verified Doctor</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{BUSINESS_INFO.doctorName}</h3>
              <p className="text-[#4CAF6E] font-semibold text-sm">{BUSINESS_INFO.qualification}</p>
              <p className="text-slate-400 text-sm">{BUSINESS_INFO.experience} · {BUSINESS_INFO.city}</p>
            </div>
            <div className="space-y-3">
              {[
                'Classical & Integrative Homeopathy',
                'Speaker — HomoeoVision 3.0 National Conference',
                'Rigomo Certified — Integrative Diabetes Treatment',
                'Online & In-Clinic Consultations Available',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-lg mb-2">Direct Contact</h4>

            <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-4 p-4 bg-[#4CAF6E]/8 hover:bg-[#4CAF6E]/15 border border-[#4CAF6E]/20 rounded-2xl transition-all group">
              <div className="p-2.5 bg-[#4CAF6E]/15 rounded-xl">
                <Phone className="h-5 w-5 text-[#4CAF6E]" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Phone</p>
                <p className="text-white font-semibold text-sm group-hover:text-[#4CAF6E] transition-colors">{BUSINESS_INFO.phone}</p>
              </div>
            </a>

            <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-[#3DAA58]/8 hover:bg-[#3DAA58]/15 border border-[#3DAA58]/20 rounded-2xl transition-all group">
              <div className="p-2.5 bg-[#3DAA58]/15 rounded-xl">
                <MessageSquare className="h-5 w-5 text-[#3DAA58]" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">WhatsApp</p>
                <p className="text-white font-semibold text-sm group-hover:text-[#3DAA58] transition-colors">{BUSINESS_INFO.phone}</p>
              </div>
            </a>

            <a href={`mailto:${BUSINESS_INFO.email}`}
              className="flex items-center gap-4 p-4 bg-white/4 hover:bg-white/8 border border-white/10 rounded-2xl transition-all group">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Mail className="h-5 w-5 text-slate-300" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Email</p>
                <p className="text-white font-semibold text-sm group-hover:text-[#4CAF6E] transition-colors">{BUSINESS_INFO.email}</p>
              </div>
            </a>

            <Link href="/book"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#C8922A] hover:bg-[#B8821A] text-[#0E1F12] font-bold rounded-2xl transition-all text-sm mt-2">
              <CalendarCheck className="h-4 w-4" />
              Book Appointment Online
            </Link>
          </div>
        </div>

        {/* ── BRANCH LOCATIONS ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[#C8922A]" />
            <h3 className="font-heading text-xl font-bold text-white">Our Branches in Kanpur</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUSINESS_INFO.branches.map((branch) => (
              <div key={branch.name} className="bg-[#1C3A22]/40 border border-[#4CAF6E]/15 rounded-3xl p-7 space-y-4 hover:border-[#4CAF6E]/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 bg-[#C8922A]/10 rounded-2xl">
                    <MapPin className="h-5 w-5 text-[#C8922A]" />
                  </div>
                  <span className="px-3 py-1 bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 text-[#4CAF6E] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {branch.tag}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-heading font-bold text-white text-lg">{branch.name}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{branch.address}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="h-4 w-4 text-[#4CAF6E] shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#4CAF6E] hover:text-white text-sm font-semibold transition-colors group">
                  View on Google Maps
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
          {/* Online Consultation Banner */}
          <div className="bg-[#4CAF6E]/8 border border-[#4CAF6E]/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#4CAF6E]" />
              <div>
                <p className="text-white font-bold text-sm">Online Consultation — All India</p>
                <p className="text-slate-400 text-xs">Aap kahi se bhi call se bat karke Online Consultation le sakte hai.</p>
              </div>
            </div>
            <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Mujhe online consultation chahiye Dr. Iqbal se`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3DAA58] hover:bg-[#2D8A48] text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap">
              <MessageSquare className="h-4 w-4" />
              Start Online Consultation
            </a>
          </div>
        </div>

        {/* ── SERVICES ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-[#4CAF6E]" />
            <h3 className="font-heading text-xl font-bold text-white">Treatments & Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BUSINESS_INFO.services.map((service) => (
              <div key={service}
                className="flex items-center gap-3 p-4 bg-[#1C3A22]/30 border border-[#4CAF6E]/10 hover:border-[#4CAF6E]/25 rounded-2xl transition-all">
                <CheckCircle2 className="h-4 w-4 text-[#4CAF6E] shrink-0" />
                <span className="text-slate-300 text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONSULTATION PROCESS ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-5 w-5 text-[#C8922A]" />
            <h3 className="font-heading text-xl font-bold text-white">Consultation Process — Itna Aasaan Hai</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BUSINESS_INFO.consultationSteps.map((item, i) => (
              <div key={i} className="relative bg-[#1C3A22]/40 border border-[#4CAF6E]/15 rounded-3xl p-6 space-y-3 hover:border-[#4CAF6E]/30 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-[#C8922A]/15 border border-[#C8922A]/25 flex items-center justify-center">
                  <span className="text-[#C8922A] font-black text-lg font-heading">{item.step}</span>
                </div>
                <h4 className="font-heading font-bold text-white text-base">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                {i < BUSINESS_INFO.consultationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-[#4CAF6E]/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-slate-400 text-sm">Abhi pehla kadam uthao — consultation bilkul FREE hai</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3DAA58] hover:bg-[#2D8A48] text-white font-bold rounded-2xl transition-all text-sm shadow-lg shadow-green-900/30">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Karein — Abhi
            </a>
            <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/6 hover:bg-white/10 border border-white/15 text-white font-bold rounded-2xl transition-all text-sm">
              <Phone className="h-5 w-5" />
              Call Karein: {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

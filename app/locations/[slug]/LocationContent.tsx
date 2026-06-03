'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Phone, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { LocationData, DEFAULT_SERVICES } from '@/lib/data';

interface LocationContentProps {
  location: LocationData;
}

export default function LocationContent({ location }: LocationContentProps) {
  const cleanPhone = location.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
    `Hello Dr. Iqbal, I am writing to you from ${location.name}. I would like to inquire about homeopathic treatment.`
  )}`;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a4b3e] to-[#04261f] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent)]"></div>
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="bg-brand-green/20 text-brand-green border border-brand-green/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Kanpur Local SEO Directory
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight max-w-4xl mx-auto">
            Best Homeopathic Clinic & Doctor in {location.name}, Kanpur
          </h1>
          <p className="text-slate-350 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {location.name} ke hazaron log chronic skin, hair, thyroid aur joint problems se permanent relief paa rahe hain — bina steroid, bina side effects ke.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href={`/book?location=${encodeURIComponent(location.name)}`}
              className="h-12 px-8 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
            >
              <Calendar className="h-4 w-4" />
              <span>FREE Consultation Book Karein</span>
            </Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
            >
              <span>WhatsApp Pe Baat Karein</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Value Proposition */}
            <div className="bg-white border border-slate-150 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-navy">
                Why {location.name} Patients Trust Dr. Iqbal's Homoeopathic Centre
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                Allopathic dawaiyaan aur bar-bar steroids badalne se tired ho chuke hain? Homeopathy offers a safe and permanent solution. 
                Hum bimari ke symptoms ko suppress nahi karte, balki target karte hain **root cause** ko. 
                Whether you live in central {location.name} or nearby locations, we ensure personalized constitutional care that heals from within.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span>10+ Years of Clinical Experience</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span>Zero Steroids, Zero Side Effects</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span>Constitutional Personalized Treatment</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span>Sweet, Safe Tinctures & Pills for Kids</span>
                </div>
              </div>
            </div>

            {/* Specialization Pages Link Cards */}
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-navy">
                Clinical Treatments Offered to {location.name} Residents
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DEFAULT_SERVICES.slice(0, 6).map((service) => (
                  <div key={service.slug} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-base text-brand-navy">{service.title}</h3>
                      <p className="text-slate-500 text-xs font-light leading-relaxed line-clamp-3">{service.shortDescription}</p>
                    </div>
                    <Link 
                      href={`/services/${service.slug}`}
                      className="text-brand-blue text-xs font-bold inline-flex items-center space-x-1 hover:text-brand-navy transition-colors"
                    >
                      <span>Read Treatment Plan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Localized FAQ Section */}
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-navy">
                Frequently Asked Questions (FAQs) for {location.name}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2.5">
                  <h4 className="font-semibold text-brand-navy text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-brand-blue shrink-0" />
                    <span>How far is HOMMED Clinic from {location.name}?</span>
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm font-light pl-6.5 leading-relaxed">
                    {location.distanceInfo} Our nearest physical branch is **{location.nearestBranch}**.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2.5">
                  <h4 className="font-semibold text-brand-navy text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-brand-blue shrink-0" />
                    <span>Can I consult Dr. Iqbal online from {location.name}?</span>
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm font-light pl-6.5 leading-relaxed">
                    Yes! If you are unable to travel, we provide dynamic **Online Consultations** via WhatsApp video call. Medicine is packed securely and dispatched to your address in {location.name} with delivery updates.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2.5">
                  <h4 className="font-semibold text-brand-navy text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-brand-blue shrink-0" />
                    <span>Are the homeopathic medicines safe for kids and pregnant women?</span>
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm font-light pl-6.5 leading-relaxed">
                    Absolutely. Homeopathy utilizes natural, highly diluted components that are completely non-toxic and side-effect free. They are highly suitable and popular for pediatric care (like tonsillitis, cold/cough, appetite, growth) and pregnancy health.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Branch Info */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Nearest Branch Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full filter blur-2xl"></div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 text-brand-green rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Nearest Branch</span>
                  <h3 className="font-heading font-bold text-sm text-brand-navy">{location.nearestBranch}</h3>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[9px]">Clinic Address</span>
                  <p className="font-medium text-brand-navy">{location.address}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[9px]">Landmark</span>
                  <p className="font-medium text-brand-navy">{location.landmark}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[9px]">Travel info</span>
                  <p className="text-slate-500 font-light leading-relaxed">{location.distanceInfo}</p>
                </div>
              </div>

              <Link
                href={`/book?location=${encodeURIComponent(location.name)}`}
                className="h-11 w-full flex items-center justify-center bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold rounded-xl text-xs transition-all shadow-sm"
              >
                Schedule Consultation Slot
              </Link>
            </div>

            {/* General Disclaimer */}
            <div className="p-5 bg-blue-50/50 border border-blue-100/60 rounded-2xl text-[11px] text-slate-500 font-light leading-relaxed space-y-2">
              <div className="flex items-center space-x-1 text-slate-700 font-bold">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-blue" />
                <span>Certified Clinical Healing</span>
              </div>
              <p>
                HOMMED is led by certified homeopathy specialists. All medical inquiries are handled with strict privacy and professional confidentiality.
              </p>
            </div>

          </aside>

        </div>
      </section>
      
    </div>
  );
}

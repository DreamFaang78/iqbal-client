'use client';

import React from 'react';
import { motion } from 'framer-motion'; // Wait, let's fix this typo: should be 'framer-motion'
import { Calendar, Award, GraduationCap, MapPin, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function DoctorProfile() {
  return (
    <section id="doctor" className="py-24 bg-[#132918] relative overflow-hidden font-sans">
      {/* Decorative Blob */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-[#4CAF6E]/8 rounded-full filter blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Doctor Photo Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Frame */}
            <div className="relative w-80 sm:w-96 h-[460px] rounded-[36px] overflow-hidden bg-[#0E1F12] border border-[#4CAF6E]/15 shadow-xl group">
              {/* Doctor Image */}
              <img 
                src="/doctor-iqbal.jpg" 
                alt="Dr. Iqbal" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/35 to-transparent"></div>
              
              {/* Floating Content Card (Glassmorphic) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-[#0E1F12]/70 backdrop-blur-md border-t border-[#4CAF6E]/15 rounded-t-[28px]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-heading text-2xl font-bold tracking-tight">Dr. Iqbal</h4>
                    <p className="text-[#4CAF6E] text-xs tracking-wider uppercase font-semibold">Chief Homoeopathic Consultant</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-full border border-white/10">
                    <Stethoscope className="h-5 w-5 text-brand-cyan" />
                  </div>
                </div>
                
                <p className="text-slate-200 text-xs italic font-light mb-4 leading-relaxed">
                  "Dedicated to restoring natural health and body balance using gentle, customized homeopathic principles."
                </p>
                
                {/* Micro Stats inside Frame */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 w-full text-left text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Registration</span>
                    <span className="font-semibold text-slate-200">HPR-UP-9843</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Consultations</span>
                    <span className="font-semibold text-slate-200">10k+ Conducted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Qualifications */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-[#4CAF6E] font-accent text-sm font-semibold tracking-wider uppercase">Meet the Specialist</span>
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Dr. Iqbal, BHMS
              </h3>
              <p className="text-[#4CAF6E] font-semibold text-base font-accent">
                15+ Years of Dedicated Clinical Experience in Classic HOMOEOPATHY
              </p>
            </div>

            <div className="text-slate-300 text-base leading-relaxed space-y-4 font-light">
              <p>
                Dr. Iqbal is a leading homoeopathic practitioner based in Kanpur, Uttar Pradesh. Having completed his Bachelor of Homoeopathic Medicine and Surgery (BHMS), he has spent over a decade and a half helping patients recover from chronic illnesses without introducing toxic loads or side effects.
              </p>
              <p>
                His treatment philosophy is rooted in <strong>constitutional homoeopathy</strong>, which analyzes each patient's physical, psychological, and hereditary traits. This ensures that therapy cures the underlying cause of disease rather than providing short-term, superficial symptom suppression.
              </p>
            </div>

            {/* Quick Qualifications & Schedule Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* Credentials */}
              <div className="flex items-start space-x-3 p-4 bg-[#1C3A22]/45 border border-[#4CAF6E]/12 rounded-2xl">
                <div className="p-2.5 bg-[#4CAF6E]/10 text-[#4CAF6E] border border-[#4CAF6E]/20 rounded-xl shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4CAF6E] text-sm font-heading">Credentials</h4>
                  <ul className="text-xs text-slate-300 space-y-1 mt-1 leading-normal">
                    <li>BHMS Graduate Physician</li>
                    <li>Specialist in Autoimmune & Skin Disorders</li>
                    <li>Registered with Medical Council (UP)</li>
                  </ul>
                </div>
              </div>

              {/* Awards */}
              <div className="flex items-start space-x-3 p-4 bg-[#1C3A22]/45 border border-[#4CAF6E]/12 rounded-2xl">
                <div className="p-2.5 bg-amber-500/10 text-brand-gold border border-brand-gold/20 rounded-xl shrink-0 mt-0.5">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-gold text-sm font-heading">Awards & Accolades</h4>
                  <ul className="text-xs text-slate-300 space-y-1 mt-1 leading-normal">
                    <li>Best Homeopath Award (Kanpur Health Summit)</li>
                    <li>Active Member, International Federation</li>
                    <li>Recognized for Child Immunity Protocols</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timings & Map Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[#4CAF6E]/20 bg-[#1C3A22]/40 rounded-3xl gap-4">
              <div className="text-sm">
                <span className="font-bold text-white block font-heading">Clinic Consultation Hours</span>
                <span className="text-slate-300 text-xs mt-0.5">Mon - Sat: 10:00 AM - 02:00 PM | 05:00 PM - 08:00 PM</span>
              </div>
              <Link href="/book" className="h-12 px-6 flex items-center justify-center space-x-2 bg-[#2D7A3A] hover:bg-[#4CAF6E] hover:text-[#0E1F12] text-white rounded-xl font-semibold transition-all shadow-md shadow-green-900/30">
                <Calendar className="h-4 w-4" />
                <span>Book a Timing Slot</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

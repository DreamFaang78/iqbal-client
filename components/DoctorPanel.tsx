'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap, Stethoscope, Phone, Award, Heart } from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  id: number;
  name: string;
  role: string;
  experience: string;
  credentials: string;
  image: string;
  bio: string;
  specialties: string[];
  color: string; // for border/glow accents
}

const doctorPanelList: Doctor[] = [
  {
    id: 1,
    name: "Dr. Iqbal Quasim",
    role: "Chief Homoeopathic Consultant & Founder",
    experience: "15+ Years Experience",
    credentials: "BHMS (Physician)",
    image: "/doctor-iqbal.jpg",
    bio: "Guided by a passion for gentle and lasting healing, Dr. Iqbal has spent over 15 years pioneering constitutional HOMOEOPATHY in Kanpur. He specializes in treating deep-seated chronic illnesses, skin disorders, and autoimmune conditions by aligning the body's natural defenses.",
    specialties: ["Constitutional Therapy", "Skin & Hair Care", "Allergy & Asthma", "Chronic Diseases"],
    color: "#4CAF6E"
  },
  {
    id: 2,
    name: "Dr. Akhilesh Kushwaha",
    role: "Senior Consultant Physician",
    experience: "12+ Years Experience",
    credentials: "BHMS, MD (Hom)",
    image: "/doctor-akhilesh.png",
    bio: "Dr. Akhilesh combines classical homoeopathic wisdom with a modern clinical approach. With over a decade of experience, he is dedicated to helping patients manage complex lifestyle conditions, digestive complaints, and joint disorders through customized, natural care plans.",
    specialties: ["Digestive & Gut Health", "Joint & Arthritis Care", "Lifestyle Diseases", "Migraine Relief"],
    color: "#C8922A"
  },
  {
    id: 3,
    name: "Dr. Roshni Singh",
    role: "Consultant Gynaecologist & Pediatrician",
    experience: "8+ Years Experience",
    credentials: "BHMS (Women & Child Specialist)",
    image: "/doctor-roshni.png",
    bio: "Dr. Roshni is committed to providing compassionate, comprehensive care for women and children. Her holistic protocols focus on restoring hormonal harmony, managing PCOS/PCOD, and strengthening children's natural immunity in a gentle, side-effect-free manner.",
    specialties: ["PCOS & Thyroid Care", "Pediatric Immunity", "Hormonal Balance", "Mother & Child Wellness"],
    color: "#4CAF6E"
  }
];

export default function DoctorPanel() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 70,
        damping: 15
      }
    }
  };

  return (
    <section id="doctor-panel" className="py-24 bg-[#0E1F12] relative overflow-hidden font-sans border-t border-[#4CAF6E]/10">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#4CAF6E]/4 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C8922A]/3 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#4CAF6E] font-accent text-sm font-semibold uppercase tracking-wider bg-[#4CAF6E]/8 border border-[#4CAF6E]/15 px-3 py-1 rounded-full">
            Our Panel of Experts
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Meet Our Specialist <span className="text-[#C8922A]">HOMOEOPATHY Doctors</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            A team of highly qualified, compassionate practitioners dedicated to identifying and treating the root causes of disease, helping you restore full, natural vitality.
          </p>
        </div>

        {/* Doctor Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {doctorPanelList.map((doc) => (
            <motion.div
              key={doc.id}
              variants={cardVariants}
              className="group flex flex-col h-full bg-[#1C3A22]/30 border border-[#4CAF6E]/12 hover:border-[#4CAF6E]/25 hover:bg-[#1C3A22]/40 rounded-[32px] overflow-hidden transition-all duration-300 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]"
            >
              
              {/* Doctor Photo Section with Badge */}
              <div className="relative h-72 w-full overflow-hidden bg-[#0E1F12] border-b border-[#4CAF6E]/8">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F12] via-[#0E1F12]/30 to-transparent"></div>
                
                {/* Float Experience tag */}
                <div className="absolute top-4 right-4 bg-[#0E1F12]/80 backdrop-blur-md border border-[#4CAF6E]/20 text-[#4CAF6E] text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Award className="h-3.5 w-3.5" />
                  <span>{doc.experience}</span>
                </div>
              </div>

              {/* Doctor Details Body */}
              <div className="flex flex-col flex-grow p-6 sm:p-7 space-y-5">
                
                {/* Doctor Identity */}
                <div>
                  <span className="text-[#4CAF6E] text-xs font-semibold uppercase tracking-wider block mb-1">
                    {doc.credentials}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-[#4CAF6E] transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-white/60 text-sm font-medium mt-1 leading-relaxed">
                    {doc.role}
                  </p>
                </div>

                {/* AI Bio */}
                <p className="text-slate-300/80 text-sm font-light leading-relaxed italic flex-grow">
                  "{doc.bio}"
                </p>

                {/* Specialties Tags */}
                <div className="space-y-2">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider block">
                    Specialized Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#4CAF6E]/6 border border-[#4CAF6E]/12 text-[#4CAF6E]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-white/8 pt-5 mt-auto flex flex-col gap-2.5">

                  {/* PRIMARY — Book Appointment (gold gradient, shimmer) */}
                  <Link
                    href={`/book?doctor=${encodeURIComponent(doc.name)}`}
                    className="group/btn relative w-full h-12 flex items-center justify-center gap-2.5 rounded-2xl overflow-hidden font-bold text-sm text-[#0E1F12] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-900/20"
                    style={{
                      background: 'linear-gradient(110deg, #C8922A 0%, #F5C842 45%, #C8922A 100%)',
                      backgroundSize: '200% 100%',
                    }}
                  >
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
                    <Calendar className="h-4 w-4 shrink-0 drop-shadow-sm" />
                    <span className="tracking-wide drop-shadow-sm">Book Appointment</span>
                  </Link>

                  {/* SECONDARY — Call button (green outline, glow on hover) */}
                  <a
                    href="tel:8707868504"
                    className="group/call relative w-full h-11 flex items-center justify-center gap-2.5 rounded-2xl border border-[#4CAF6E]/30 bg-[#4CAF6E]/5 hover:bg-[#4CAF6E]/12 hover:border-[#4CAF6E]/60 text-[#4CAF6E] hover:text-white text-sm font-semibold transition-all duration-250 overflow-hidden"
                  >
                    {/* Subtle background sweep on hover */}
                    <span className="absolute inset-0 translate-x-[-110%] group-hover/call:translate-x-[110%] transition-transform duration-500 bg-gradient-to-r from-transparent via-[#4CAF6E]/10 to-transparent pointer-events-none" />
                    {/* Pulsing ring on icon */}
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-5 h-5 rounded-full bg-[#4CAF6E]/20 group-hover/call:scale-150 group-hover/call:opacity-0 transition-all duration-500" />
                      <Phone className="h-4 w-4 relative z-10" />
                    </span>
                    <span className="tracking-wide">Call Now • 8707868504</span>
                  </a>

                </div>

              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner */}
        <div className="mt-16 p-6 sm:p-8 bg-[#1C3A22]/20 border border-[#4CAF6E]/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 text-[#4CAF6E] rounded-2xl shrink-0">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg font-heading">Looking for a specific treatment?</h4>
              <p className="text-slate-400 text-sm font-light mt-0.5">
                Our doctors coordinate with each other to design a comprehensive constitutional treatment plan just for you.
              </p>
            </div>
          </div>
          <Link
            href="/book"
            className="w-full md:w-auto h-12 px-6 flex items-center justify-center gap-2 bg-[#C8922A] hover:bg-[#C8922A]/90 text-[#0E1F12] rounded-xl font-bold text-sm transition-all shadow-md shrink-0"
          >
            <span>Consult The Panel</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

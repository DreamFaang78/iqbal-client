'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Presentation, Play, Calendar, MapPin, BookOpen, Users, Sparkles } from 'lucide-react';

export default function Achievements() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 45 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 65,
        damping: 16
      }
    }
  };

  return (
    <section id="achievements" className="py-24 bg-[#132918] relative overflow-hidden font-sans border-t border-[#4CAF6E]/10">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#4CAF6E]/4 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#C8922A]/3 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4CAF6E]/20 bg-[#4CAF6E]/8 text-[#4CAF6E] text-xs font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-3 w-3 animate-pulse text-[#4CAF6E]" />
            Clinical Leadership & Recognition
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Milestones of <span className="text-[#C8922A]">Scientific Excellence</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Recognized by peak medical institutions and trusted to educate the next generation of practitioners in advanced HOMOEOPATHY.
          </p>
        </div>

        {/* 2-Column Grid of Achievements */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          
          {/* Card 1: Homoeopathic Icon Award 2025 */}
          <motion.div 
            variants={cardVariants}
            className="glass-card flex flex-col justify-between p-8 sm:p-10 rounded-[32px] bg-[#1C3A22]/40 border border-[#4CAF6E]/12 hover:border-[#4CAF6E]/30 relative group"
          >
            {/* Soft background light behind the icon */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-[#C8922A]/10 rounded-full filter blur-xl group-hover:bg-[#C8922A]/15 transition-all duration-300 pointer-events-none" />

            <div className="space-y-6">
              
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-brand-gold/20 text-[#C8922A] text-xs font-bold uppercase tracking-wider">
                  <Award className="h-3.5 w-3.5" />
                  National Honor
                </span>
                <div className="p-3 bg-amber-500/10 text-brand-gold border border-brand-gold/20 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-[#C8922A]" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Homoeopathic Icon Award 2025
                </h3>
                
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4.5 w-4.5 text-[#4CAF6E] shrink-0 mt-0.5" />
                    <span>Atal Bihari Vajpayee Scientific Convention Centre, KGMU, Lucknow</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Users className="h-4.5 w-4.5 text-[#4CAF6E] shrink-0 mt-0.5" />
                    <span>Presented by Hahnemann Educational & Development Society in association with Indian Society of Homoeopathy</span>
                  </div>
                </div>
              </div>

              {/* Copywriter-styled body text */}
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">
                Conferred in recognition of Dr. Iqbal's pioneering contributions to natural medicine and outstanding clinical outcomes in Uttar Pradesh. This prestigious award, presented at the state's leading scientific convention venue by India's peak homoeopathic authorities, validates over 15 years of dedicated patient care and safe, systemic healing.
              </p>
            </div>

            {/* Bottom visual decoration */}
            <div className="pt-8 mt-8 border-t border-white/8 flex items-center justify-between text-xs text-[#C8922A]/70 uppercase tracking-widest font-semibold">
              <span>Scientific Excellence</span>
              <span>January 2025</span>
            </div>
          </motion.div>

          {/* Card 2: HomoeoVision 3.0 Speaker & Lecture */}
          <motion.div 
            variants={cardVariants}
            className="glass-card flex flex-col justify-between p-8 sm:p-10 rounded-[32px] bg-[#1C3A22]/40 border border-[#4CAF6E]/12 hover:border-[#4CAF6E]/30 relative group"
          >
            {/* Soft background light behind the icon */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-[#4CAF6E]/10 rounded-full filter blur-xl group-hover:bg-[#4CAF6E]/15 transition-all duration-300 pointer-events-none" />

            <div className="space-y-6">
              
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 text-[#4CAF6E] text-xs font-bold uppercase tracking-wider">
                  <Presentation className="h-3.5 w-3.5" />
                  Academic Presentation
                </span>
                <div className="p-3 bg-[#4CAF6E]/10 text-[#4CAF6E] border border-[#4CAF6E]/20 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Presentation className="h-8 w-8 text-[#4CAF6E]" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Clinical Speaker at HomoeoVision 3.0
                </h3>
                
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Calendar className="h-4.5 w-4.5 text-[#C8922A] shrink-0" />
                  <span>National Conference for Homoeopathic Physicians</span>
                </div>

                {/* Topic Banner */}
                <div className="p-4 rounded-2xl bg-[#0E1F12]/80 border border-[#4CAF6E]/15 space-y-1">
                  <span className="text-[10px] text-[#C8922A] font-bold uppercase tracking-widest block">LECTURE TOPIC</span>
                  <span className="text-white text-sm sm:text-base font-bold font-heading italic block">
                    “The Role of Homoeopathy in Chronic Kidney Failure”
                  </span>
                </div>
              </div>

              {/* Copywriter-styled body text */}
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">
                Dr. Iqbal was invited to deliver a clinical lecture to practicing physicians at the national HomoeoVision 3.0 conference. Sharing advanced case files and constitutional therapeutic protocols for managing chronic renal failure, his lecture demonstrated how specialized homoeopathic care helps manage kidney pathologies and improves patient longevity.
              </p>

              {/* Interactive Video Player Placeholder */}
              <div className="relative rounded-2xl overflow-hidden border border-[#4CAF6E]/15 bg-[#0E1F12] aspect-video flex items-center justify-center group/video shadow-inner">
                {/* Visual medical waveform background effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4CAF6E] via-transparent to-transparent pointer-events-none" />
                
                {/* Mock player layout */}
                <div className="relative z-10 flex flex-col items-center gap-3 p-4 text-center">
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    {/* Ring ping animation */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8922A]/20 opacity-75" />
                    <button className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#C8922A] hover:text-[#0E1F12] text-white border border-white/20 transition-all duration-300 shadow-lg cursor-pointer group-hover/video:scale-110">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">HomoeoVision 3.0 Presentation Video</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Clinical Lecture Uploading Soon</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom visual decoration */}
            <div className="pt-8 mt-8 border-t border-white/8 flex items-center justify-between text-xs text-[#4CAF6E]/70 uppercase tracking-widest font-semibold">
              <span>Academic Leadership</span>
              <span>National Conference</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}

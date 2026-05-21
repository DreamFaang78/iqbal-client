'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Play, X, MessageSquare, Calendar } from 'lucide-react';
import { DEFAULT_TESTIMONIALS } from '@/lib/data';

const CASE_STUDIES = [
  {
    id: 'case-eczema',
    title: 'Severe Facial Eczema',
    patient: 'Ananya S. (19/F)',
    duration: '4 Weeks Recovery',
    tag: 'Eczema & Dermatitis',
    image: '/case-2.jpg',
    description: 'Suffered from intense flaking, redness, and inflammation across forehead and nose. Completely resolved without steroid rebound.',
    whatsappMsg: 'Hi Dr. Iqbal, I saw the before/after case of Ananya (Facial Eczema) on your website. I have similar symptoms and want to consult.',
    aiQuery: 'How does constitutional homeopathy cure facial eczema and autoimmune skin issues?',
    serviceParam: 'Skin Disorders'
  },
  {
    id: 'case-herpes',
    title: 'Recurring Oral Herpes',
    patient: 'Yasmin K. (28/F)',
    duration: '2 Weeks Recovery',
    tag: 'Skin Infection',
    image: '/case-1.jpg',
    description: 'Experienced recurring painful lip lesions every month. Cleared completely and recurrence halted using anti-viral homeopathy.',
    whatsappMsg: 'Hi Dr. Iqbal, I saw the before/after case of Yasmin (Oral Herpes/Lip Sore) on your website. I have similar symptoms and want to consult.',
    aiQuery: 'What is the homeopathic approach to recurring oral herpes and chronic lip lesions?',
    serviceParam: 'Skin Disorders'
  },
  {
    id: 'case-melasma',
    title: 'Chronic Melasma (Chhaiya)',
    patient: 'Mrs. Farida (34/F)',
    duration: '3 Months Recovery',
    tag: 'Pigmentation & Melasma',
    image: '/case-3.jpg',
    description: 'Symmetrical deep dark patches on cheeks and forehead. Resolved from the root using endocrine-balancing natural remedies.',
    whatsappMsg: 'Hi Dr. Iqbal, I saw the before/after case of Mrs. Farida (Melasma/Pigmentation) on your website. I have similar dark spots and want to consult.',
    aiQuery: 'How does homeopathy treat deep-seated facial melasma and hormonal pigmentation?',
    serviceParam: 'Skin Disorders'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DEFAULT_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DEFAULT_TESTIMONIALS.length) % DEFAULT_TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-[#0D1F3A] bg-grid relative overflow-hidden font-sans">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand-blue/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-cyan font-accent text-sm font-semibold uppercase tracking-wider">Patient Stories</span>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Loved by Thousands of Recovered Patients
          </h3>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Real feedback from individuals who overcame chronic conditions through our advanced homeopathic treatment plans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Review Slider */}
          <div className="lg:col-span-7 relative">
            <Quote className="absolute -top-10 -left-6 h-20 w-20 text-white/5 -z-10 select-none" />
            
            <div className="min-h-[260px] bg-[#162847]/45 border border-white/10 rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(DEFAULT_TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-200 text-base sm:text-lg italic leading-relaxed font-light">
                    "{DEFAULT_TESTIMONIALS[currentIndex].content}"
                  </p>

                  {/* Profile */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <h4 className="font-heading font-bold text-base text-white">
                        {DEFAULT_TESTIMONIALS[currentIndex].name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {DEFAULT_TESTIMONIALS[currentIndex].location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation controls */}
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handlePrev}
                className="p-3 bg-[#162847]/50 hover:bg-[#162847]/80 border border-white/12 rounded-xl transition-all text-white hover:shadow-sm cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-[#162847]/50 hover:bg-[#162847]/80 border border-white/12 rounded-xl transition-all text-white hover:shadow-sm cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              <span className="text-xs text-slate-400 font-medium pl-2">
                {currentIndex + 1} of {DEFAULT_TESTIMONIALS.length} verified reviews
              </span>
            </div>
          </div>

          {/* Right Column: Video Testimonial Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              className="relative w-80 sm:w-96 h-[260px] rounded-3xl bg-slate-900 overflow-hidden shadow-xl border border-slate-800 cursor-pointer group flex items-center justify-center text-center"
              onClick={() => setIsVideoOpen(true)}
            >
              {/* Overlay styling for backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy via-slate-950 to-slate-900 opacity-90"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.2),transparent_70%)]"></div>

              {/* Play Button overlay */}
              <div className="relative z-10 space-y-4 p-6">
                <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-blue group-hover:border-brand-blue text-white transition-all duration-300 shadow-lg">
                  <Play className="h-6 w-6 fill-current pl-1" />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading text-sm sm:text-base">Video Patient Story</h4>
                  <p className="text-slate-400 text-xs mt-1">Watch Amit explain his son's chronic Tonsillitis recovery</p>
                </div>
              </div>

              {/* Verified Trust Emblem */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1.5 bg-brand-blue/20 border border-brand-blue/30 px-3 py-1 rounded-full text-brand-blue text-[10px] font-semibold uppercase">
                <span>Verified Case</span>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Before & After Cases */}
        <div className="border-t border-white/10 pt-16 mt-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-brand-gold font-accent text-sm font-semibold uppercase tracking-wider">Clinical Results</span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verified Before & After Transformations
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Actual clinical results showing permanent healing of chronic skin disorders through targeted homeopathy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CASE_STUDIES.map((study) => (
              <div 
                key={study.id} 
                className="bg-[#162847]/40 border border-white/10 rounded-[28px] overflow-hidden flex flex-col justify-between group shadow-premium hover:border-brand-cyan/30 transition-all duration-300"
              >
                {/* Image Wrapper */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950 border-b border-white/5">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-[#0A1628]/95 backdrop-blur-md text-brand-cyan text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-xl border border-brand-cyan/20">
                    {study.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-heading text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {study.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                      <span>{study.patient}</span>
                      <span>•</span>
                      <span className="text-brand-gold">{study.duration}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-light">
                      {study.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent('open-ai-chat', {
                              detail: { query: study.aiQuery }
                            })
                          );
                        }}
                        className="h-9 px-3 bg-brand-blue/10 hover:bg-brand-blue text-brand-cyan hover:text-white border border-brand-blue/20 hover:border-brand-blue rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Ask AI Chat</span>
                      </button>

                      <a
                        href={`https://wa.me/918756124708?text=${encodeURIComponent(study.whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.006-5.04-2.834-6.87-1.827-1.829-4.262-2.837-6.856-2.838-5.437 0-9.862 4.371-9.865 9.731-.001 1.748.461 3.456 1.336 4.965l-.975 3.561 3.656-.97c1.52.88 3.12 1.34 4.85 1.34z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        window.location.href = `/book?service=${encodeURIComponent(study.serviceParam)}`;
                      }}
                      className="w-full h-9 bg-brand-gold hover:bg-brand-gold-light text-brand-navy rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Book Skin Consultation</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-8 text-center text-white">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-6 max-w-md mx-auto py-8">
              <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-full w-fit mx-auto text-brand-blue">
                <Play className="h-10 w-10 fill-current pl-1" />
              </div>
              <h3 className="font-heading text-2xl font-bold">Amit's Case Study</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                "Our 6-year-old son experienced recurring throat inflammation. Daily antibiotics caused digestive stress. Under Dr. Iqbal, our son received soft pills that boosted his immunity. In 8 months, throat pain has vanished completely."
              </p>
              <div className="pt-4 border-t border-slate-800 flex justify-center space-x-6 text-xs text-slate-500">
                <span>Case ID: CS-9831</span>
                <span>•</span>
                <span>Kanpur, UP</span>
                <span>•</span>
                <span>Treated: Tonsillitis</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

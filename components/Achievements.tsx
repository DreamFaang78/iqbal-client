'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Presentation, Play, Calendar, MapPin, Users, Sparkles, X, Maximize2 } from 'lucide-react';

interface AchievementItem {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  venue: string;
  venueIcon: React.ReactNode;
  org?: string;
  orgIcon?: React.ReactNode;
  topicLabel?: string;
  topic?: string;
  description: string;
  imageSrc: string;
  footerTag: string;
  footerDate: string;
  hasVideoPlaceholder?: boolean;
}

export default function Achievements() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scroll when lightbox is active
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  const achievementsData: AchievementItem[] = [
    {
      id: 'award-2025',
      badge: 'National Honor',
      badgeIcon: <Award className="h-3.5 w-3.5" />,
      title: 'Homoeopathic Icon Award 2025',
      subtitle: 'Conferred State Honor & Recognition',
      venue: 'Atal Bihari Vajpayee Scientific Convention Centre, KGMU, Lucknow',
      venueIcon: <MapPin className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />,
      org: 'Presented by Hahnemann Educational & Development Society in association with Indian Society of Homoeopathy',
      orgIcon: <Users className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />,
      description: "UP ke sabse bade scientific platform — KGMU Lucknow — par Dr. Iqbal ko 'Homoeopathic Icon Award 2025' diya gaya. Yeh award unke 10 saal ke kaam ka, 10,000 patients ke bharose ka — public recognition hai.",
      imageSrc: '/Iqbal-Achievement.jpeg',
      footerTag: 'Scientific Excellence',
      footerDate: 'January 2025'
    },
    {
      id: 'lecture-homoeovision',
      badge: 'Academic Leadership',
      badgeIcon: <Presentation className="h-3.5 w-3.5" />,
      title: 'Clinical Speaker at HomoeoVision 3.0',
      subtitle: 'Educating & Guiding the Medical Community',
      venue: 'National Conference for Homoeopathic Physicians',
      venueIcon: <Calendar className="h-4 w-4 text-[#C8922A] shrink-0 mt-0.5" />,
      topicLabel: 'LECTURE TOPIC',
      topic: '“The Role of Homoeopathy in Chronic Kidney Failure”',
      description: "Poore desh ke doctors ne Dr. Iqbal se seekha — National Conference HomoeoVision 3.0 mein unhone Chronic Kidney Failure mein Homeopathy ke role par lecture diya. Jab doctors doctors ko seekhate hain — toh aap sahi haath mein hain.",
      imageSrc: '/Iqbal-Achievement02.jpeg',
      footerTag: 'Academic Leadership',
      footerDate: 'National Conference',
      hasVideoPlaceholder: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 55,
        damping: 18
      }
    }
  };

  return (
    <section id="achievements" className="reveal-on-scroll py-24 bg-[#132918] relative overflow-hidden font-sans border-t border-[#4CAF6E]/10">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#4CAF6E]/4 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#C8922A]/3 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4CAF6E]/20 bg-[#4CAF6E]/8 text-[#4CAF6E] text-xs font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-3 w-3 animate-pulse text-[#4CAF6E]" />
            Clinical Leadership & Recognition
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sirf Hum Nahi Kehte — <span className="text-[#C8922A]">Poora Desh Maanta Hai</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Recognized by peak medical institutions and trusted to educate the next generation of practitioners in advanced constitutional homoeopathy.
          </p>
        </div>

        {/* Stack of Achievement Editorial Cards */}
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {achievementsData.map((item, index) => (
            <motion.div 
              key={item.id}
              variants={cardVariants}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch glass-card p-6 sm:p-8 md:p-10 rounded-[32px] bg-[#1C3A22]/20 border border-[#4CAF6E]/12 hover:border-[#4CAF6E]/25 relative group overflow-hidden ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Soft background light behind the card */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-[#4CAF6E]/5 rounded-full filter blur-xl group-hover:bg-[#4CAF6E]/8 transition-all duration-300 pointer-events-none" />

              {/* Image Showcase Column */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center relative shrink-0">
                <div 
                  onClick={() => setActiveImage(item.imageSrc)}
                  className="relative rounded-2xl overflow-hidden border border-[#4CAF6E]/15 bg-[#0E1F12] aspect-[4/3] sm:aspect-video lg:aspect-[4/3] group/img cursor-pointer shadow-premium select-none"
                >
                  <img 
                    src={item.imageSrc} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                  
                  {/* Frosted zoom / click to view overlay */}
                  <div className="absolute inset-0 bg-[#0E1F12]/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-xl bg-[#0E1F12]/80 border border-[#4CAF6E]/30 text-white text-xs font-semibold flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="h-3.5 w-3.5 text-[#4CAF6E]" />
                      <span>Expand Achievement Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-6 lg:py-2">
                <div className="space-y-5">
                  {/* Badge & Icon Header */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 text-[#4CAF6E] text-xs font-bold uppercase tracking-wider">
                      {item.badgeIcon}
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[#C8922A] text-sm sm:text-base font-semibold font-heading">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Metadata info */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-start gap-2.5">
                      {item.venueIcon}
                      <span>{item.venue}</span>
                    </div>
                    {item.org && (
                      <div className="flex items-start gap-2.5">
                        {item.orgIcon}
                        <span>{item.org}</span>
                      </div>
                    )}

                    {/* Lecture Topic banner */}
                    {item.topic && (
                      <div className="mt-3 p-4 rounded-xl bg-[#0E1F12]/90 border border-[#4CAF6E]/15 space-y-1 max-w-xl">
                        <span className="text-[10px] text-[#C8922A] font-bold uppercase tracking-widest block">{item.topicLabel}</span>
                        <span className="text-white text-sm sm:text-base font-bold font-heading italic block">
                          {item.topic}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body description */}
                  <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                    {item.description}
                  </p>

                  {/* Lecture video indicator */}
                  {item.hasVideoPlaceholder && (
                    <div className="pt-2 flex items-center gap-3 text-xs text-white/50 bg-[#0E1F12]/40 rounded-xl p-3 border border-[#4CAF6E]/10 max-w-md">
                      <div className="h-8 w-8 rounded-full bg-[#C8922A]/10 border border-[#C8922A]/20 flex items-center justify-center shrink-0">
                        <Play className="h-3.5 w-3.5 text-[#C8922A] fill-current ml-0.5 animate-pulse" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">Lecture Presentation Video</span>
                        <span className="text-[10px] block mt-0.5">Clinical video upload in progress. Preview will be accessible here.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                <div className="pt-6 border-t border-white/8 flex items-center justify-between text-xs text-[#4CAF6E]/70 uppercase tracking-widest font-semibold">
                  <span>{item.footerTag}</span>
                  <span className="text-slate-400">{item.footerDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out select-none"
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-[#4CAF6E] transition-all border border-white/10 z-50 cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Image container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] sm:max-h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0E1F12] shadow-premium flex items-center justify-center cursor-default"
            >
              <img 
                src={activeImage} 
                alt="Enlarged achievement view" 
                className="max-w-full max-h-[85vh] sm:max-h-[80vh] object-contain w-auto h-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

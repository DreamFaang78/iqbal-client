'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Heart, Stethoscope, Users, Building } from 'lucide-react';

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

export default function ClinicGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: '/gallery-1.jpg',
      title: 'Chief Physician consultation',
      category: 'Patient Care',
      description: 'Dr. Iqbal Quasim conducting a detailed constitutional study and medical checkup.',
      icon: <Stethoscope className="h-4 w-4" />
    },
    {
      id: 2,
      src: '/gallery-2.jpg',
      title: 'Clinical Consultation Desk',
      category: 'Diagnosis',
      description: 'One-on-one sessions helping patients understand their symptoms and customized healing options.',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 3,
      src: '/gallery-3.jpg',
      title: 'Our Specialist Panel',
      category: 'Expertise',
      description: 'Consultation discussions prioritizing patient welfare and root-cause mapping.',
      icon: <Building className="h-4 w-4" />
    },
    {
      id: 4,
      src: '/gallery-4.jpg',
      title: 'Advanced Diagnosis Routine',
      category: 'Diagnostics',
      description: 'Applying modern diagnostic methods alongside classic HOMOEOPATHY principles.',
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: 5,
      src: '/gallery-5.jpg',
      title: 'Dedicated Wellness Interaction',
      category: 'Patient Care',
      description: 'Building deep trust with our visitors through empathetic care and precise follow-ups.',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 6,
      src: '/gallery-6.jpg',
      title: 'Modern Clinic Environment',
      category: 'Facilities',
      description: 'Clean, professional, and welcoming space designed to promote holistic healing.',
      icon: <Building className="h-4 w-4" />
    },
    {
      id: 7,
      src: '/gallery-7.jpg',
      title: 'Personalized Treatment Mapping',
      category: 'Therapy',
      description: 'Formulating side-effect-free, constitutional remedies tailored to individual body dynamics.',
      icon: <Stethoscope className="h-4 w-4" />
    },
    {
      id: 8,
      src: '/gallery-8.jpg',
      title: 'Healing Dialogues',
      category: 'Patient Care',
      description: 'Discussing lifestyle alterations and natural recovery milestones with the patients.',
      icon: <Heart className="h-4 w-4" />
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-[#132918] relative overflow-hidden font-sans border-t border-[#4CAF6E]/10">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#4CAF6E]/6 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C8922A]/4 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#4CAF6E] font-accent text-sm font-semibold uppercase tracking-wider bg-[#4CAF6E]/8 border border-[#4CAF6E]/15 px-3 py-1 rounded-full">
            Clinic Gallery
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our Clinical Excellence <span className="text-[#C8922A]">In Action</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Real moments from our advanced HOMOEOPATHY clinic in Kanpur—showcasing our panel, clinical consultations, and dedicated patient care environments.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative group rounded-3xl overflow-hidden bg-[#0E1F12] border border-[#4CAF6E]/12 cursor-pointer shadow-lg aspect-square"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setSelectedImage(item)}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-[#0E1F12]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                
                {/* Category Badge */}
                <div className="flex items-center gap-1.5 self-start text-[#4CAF6E] bg-[#4CAF6E]/10 border border-[#4CAF6E]/20 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
                  {item.icon}
                  <span>{item.category}</span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-heading font-bold text-base leading-tight">
                      {item.title}
                    </h4>
                    <div className="p-1.5 bg-[#4CAF6E]/25 text-[#4CAF6E] rounded-lg">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>

              {/* Subtle Ambient Bottom Shadow */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300"></div>
              
              {/* Category tag visible initially at bottom */}
              <div className="absolute bottom-4 left-4 bg-[#0E1F12]/80 backdrop-blur-sm border border-white/5 px-3 py-1 rounded-xl text-white/80 text-[10px] uppercase font-medium tracking-wider group-hover:opacity-0 transition-opacity duration-300">
                {item.category}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full bg-[#0E1F12] border border-[#4CAF6E]/20 rounded-[32px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 hover:text-red-400 border border-white/10 rounded-full text-white transition-all z-20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Lightbox content grid */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Image panel */}
                <div className="md:col-span-8 bg-black flex items-center justify-center max-h-[70vh] md:max-h-[80vh]">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info panel */}
                <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#132918] border-t md:border-t-0 md:border-l border-[#4CAF6E]/12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#4CAF6E] bg-[#4CAF6E]/8 border border-[#4CAF6E]/15 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-xl w-fit">
                      {selectedImage.icon}
                      <span>{selectedImage.category}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white leading-tight">
                      {selectedImage.title}
                    </h3>
                    <p className="text-slate-300 text-sm font-light leading-relaxed">
                      {selectedImage.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/8 text-xs text-[#4CAF6E]/70 font-accent uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    <span>HOMMED Kanpur Clinical Excellence</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileCheck, ExternalLink, Building2, MapPin, Calendar, CheckCircle2, X, Maximize2, Sparkles, Award } from 'lucide-react';

interface CredentialDetail {
  label: string;
  value: string;
}

interface CredentialItem {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  issuingOrg: string;
  issuingOrgIcon: React.ReactNode;
  details: CredentialDetail[];
  verifyUrl?: string;
  description: string;
  imageSrc: string;
  altText: string;
  footerTag: string;
  footerDate: string;
}

export default function RegisteredCertified() {
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

  // Prevent background scroll when lightbox is active
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

  const credentialsData: CredentialItem[] = [
    {
      id: 'gst-registration',
      badge: 'GOVERNMENT REGISTERED',
      badgeIcon: <Building2 className="h-3.5 w-3.5" />,
      title: 'GST Registration Certificate',
      subtitle: 'Form GST REG-06, Government of India',
      issuingOrg: 'Issued by Government of India & Commercial Tax Department, Uttar Pradesh',
      issuingOrgIcon: <ShieldCheck className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />,
      details: [
        { label: 'Legal Name', value: 'Iqbal Quasim' },
        { label: 'Trade Name', value: "HOM MED-DR. Iqbal's Homoeopathic Centre" },
        { label: 'GSTIN', value: '09AAJPQ9486F1ZY' },
        { label: 'Registered Address', value: '14/106, Civil Lines, Kanpur, Uttar Pradesh - 208001' },
        { label: 'Date of Registration', value: '21 January 2026' },
      ],
      description: 'Government of India GST Act 2017 ke tehat Form GST REG-06 registration certificate — official legal business entity identity for HOM MED-DR. Iqbal\'s Homoeopathic Centre, Kanpur. Har billing aur medical service fully compliant hai.',
      imageSrc: '/hommed-gst-certificate.jpg',
      altText: "GST Registration Certificate for HOM MED Dr. Iqbal's Homoeopathic Centre",
      footerTag: 'Statutory Business Credential',
      footerDate: 'Registered 21 Jan 2026'
    },
    {
      id: 'gmp-compliance',
      badge: 'GMP COMPLIANCE CERTIFIED',
      badgeIcon: <ShieldCheck className="h-3.5 w-3.5" />,
      title: 'GMP Certificate of Compliance',
      subtitle: 'Issued by Q2A UK Certification Board',
      issuingOrg: 'Q2A UK Certification Board — Certificate No: Q2A-2026-0728T133451',
      issuingOrgIcon: <Award className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />,
      details: [
        { label: 'Certificate No', value: 'Q2A-2026-0728T133451' },
        { label: 'Scope', value: 'Manufacturing, Trading and Providing Services of Homoeopathic, Cosmetics, Skin Care Product and Treatment' },
        { label: 'Validity Period', value: '28 July 2026 – 27 July 2029' },
      ],
      verifyUrl: 'https://certificate.q2acb.uk',
      description: 'Good Manufacturing Practice (GMP) compliance certification by Q2A UK Certification Board. Homoeopathic remedies, skin care products, aur clinical treatment services ke quality management standards ki international verification.',
      imageSrc: '/hommed-gmp-certificate.jpg',
      altText: "GMP Certificate of Compliance for HOM MED Dr. Iqbal's Homoeopathic Centre",
      footerTag: 'Good Manufacturing Practice',
      footerDate: 'Valid July 2026 – July 2029'
    },
    {
      id: 'iso-9001-2015',
      badge: 'ISO 9001:2015 QUALITY MANAGEMENT',
      badgeIcon: <FileCheck className="h-3.5 w-3.5" />,
      title: 'ISO 9001:2015 Certificate of Compliance',
      subtitle: 'Issued by Q2A UK Certification Board',
      issuingOrg: 'Q2A UK Certification Board — Certificate No: Q2A-2026-0805T134331',
      issuingOrgIcon: <Award className="h-4 w-4 text-[#4CAF6E] shrink-0 mt-0.5" />,
      details: [
        { label: 'Certificate No', value: 'Q2A-2026-0805T134331' },
        { label: 'Scope', value: 'Manufacturing, Trading and Providing Services of Homoeopathic, Cosmetics, Skin Care Product and Treatment' },
        { label: 'Validity Period', value: '05 August 2026 – 04 August 2029' },
      ],
      verifyUrl: 'https://certificate.q2acb.uk',
      description: 'ISO 9001:2015 Quality Management Systems certification issued by Q2A UK Certification Board. Clinical services, patient management, aur product quality standardisation par international quality benchmark.',
      imageSrc: '/hommed-iso-certificate.jpg',
      altText: "ISO 9001:2015 Certificate of Compliance for HOM MED Dr. Iqbal's Homoeopathic Centre",
      footerTag: 'International Quality Management',
      footerDate: 'Valid Aug 2026 – Aug 2029'
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
    <section id="registered-certified" className="reveal-on-scroll py-24 bg-[#0E1F12] relative overflow-hidden font-sans border-t border-[#4CAF6E]/10">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#4CAF6E]/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#C8922A]/4 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4CAF6E]/20 bg-[#4CAF6E]/8 text-[#4CAF6E] text-xs font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-3 w-3 animate-pulse text-[#4CAF6E]" />
            Official Business Credentials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Registered & <span className="text-[#4CAF6E]">Certified</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Har cheez transparent — legal registration, quality management standards, aur international compliance credentials.
          </p>
        </div>

        {/* Stack of Editorial Credential Cards */}
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {credentialsData.map((item, index) => (
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
                  <Image
                    src={item.imageSrc}
                    alt={item.altText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-2 transition-transform duration-700 group-hover/img:scale-105"
                  />
                  
                  {/* Frosted zoom / click to view overlay */}
                  <div className="absolute inset-0 bg-[#0E1F12]/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-xl bg-[#0E1F12]/80 border border-[#4CAF6E]/30 text-white text-xs font-semibold flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="h-3.5 w-3.5 text-[#4CAF6E]" />
                      <span>Expand Certificate Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-6 lg:py-2">
                <div className="space-y-5">
                  {/* Badge Header */}
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

                  {/* Issuing Body Line */}
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    {item.issuingOrgIcon}
                    <span className="font-medium">{item.issuingOrg}</span>
                  </div>

                  {/* Structured Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0E1F12]/80 border border-[#4CAF6E]/15 text-xs">
                    {item.details.map((dt) => (
                      <div key={dt.label} className={dt.label === 'Registered Address' || dt.label === 'Scope' ? 'sm:col-span-2 space-y-0.5' : 'space-y-0.5'}>
                        <span className="text-[#C8922A] text-[10px] font-bold uppercase tracking-wider block">{dt.label}</span>
                        <span className="text-white font-semibold block leading-relaxed">{dt.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Optional Verify Link Button */}
                  {item.verifyUrl && (
                    <div className="pt-1">
                      <a
                        href={item.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4CAF6E]/10 hover:bg-[#4CAF6E]/20 border border-[#4CAF6E]/30 text-[#4CAF6E] hover:text-white text-xs font-semibold transition-all group/btn"
                      >
                        <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>Verify Certificate ({new URL(item.verifyUrl).hostname})</span>
                      </a>
                    </div>
                  )}

                  {/* Body description */}
                  <p className="text-white/70 text-sm font-light leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
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
              aria-label="Close certificate preview"
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
              className="relative max-w-4xl max-h-[85vh] sm:max-h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0E1F12] shadow-premium flex items-center justify-center cursor-default p-4"
            >
              <Image
                src={activeImage}
                alt="Enlarged certificate preview"
                width={1200}
                height={1600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="max-w-full max-h-[80vh] object-contain w-auto h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

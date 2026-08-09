'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, ExternalLink, Building2, Sparkles, Award } from 'lucide-react';

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
  footerTag: string;
  footerDate: string;
}

export default function RegisteredCertified() {
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
      footerTag: 'International Quality Management',
      footerDate: 'Valid Aug 2026 – Aug 2029'
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
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
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {credentialsData.map((item) => (
            <motion.div 
              key={item.id}
              variants={cardVariants}
              className="glass-card p-6 sm:p-8 md:p-10 rounded-[32px] bg-[#1C3A22]/20 border border-[#4CAF6E]/12 hover:border-[#4CAF6E]/25 relative group overflow-hidden"
            >
              {/* Soft background light behind the card */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-[#4CAF6E]/5 rounded-full filter blur-xl group-hover:bg-[#4CAF6E]/8 transition-all duration-300 pointer-events-none" />

              {/* Content Column */}
              <div className="w-full flex flex-col justify-between space-y-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#0E1F12]/80 border border-[#4CAF6E]/15 text-xs">
                    {item.details.map((dt) => (
                      <div key={dt.label} className={dt.label === 'Registered Address' || dt.label === 'Scope' ? 'sm:col-span-2 md:col-span-3 space-y-0.5' : 'space-y-0.5'}>
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
                  <p className="text-white/70 text-sm font-light leading-relaxed max-w-3xl">
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
    </section>
  );
}


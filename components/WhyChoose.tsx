'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, ShieldCheck, Sparkle, Activity } from 'lucide-react';
 
export default function WhyChoose() {
  const points = [
    {
      id: 1,
      icon: <HeartHandshake className="h-6 w-6 text-brand-blue" />,
      title: 'Personalized Care',
      desc: 'We do not believe in "one size fits all". Every treatment is individually customized based on your full constitutional health profile.'
    },
    {
      id: 2,
      icon: <Sparkles className="h-6 w-6 text-brand-purple" />,
      title: 'Advanced Homeopathy',
      desc: 'We utilize modern clinical diagnostics alongside classic homeopathic philosophies to achieve permanent and speedy recovery.'
    },
    {
      id: 3,
      icon: <ShieldCheck className="h-6 w-6 text-brand-green" />,
      title: '100% Safe Medicines',
      desc: 'Our natural remedies are prepared under strict quality guidelines. They are completely non-toxic, chemical-free, and safe for all ages.'
    },
    {
      id: 4,
      icon: <Sparkle className="h-6 w-6 text-brand-cyan" />,
      title: 'Natural Treatments',
      desc: 'We stimulate your body’s internal healing ability. The recovery is completely natural and does not cause drug dependency.'
    },
    {
      id: 5,
      icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
      title: 'Trusted Consultations',
      desc: 'With 15+ years of verified history, we offer clinic visits in Kanpur and online digital follow-ups for ultimate convenience.'
    },
    {
      id: 6,
      icon: <Activity className="h-6 w-6 text-brand-gold" />,
      title: 'Root-Cause Resolution',
      desc: 'We analyze your full health picture to resolve the underlying root cause of chronic illness rather than merely suppressing surface symptoms.'
    }
  ];
 
  return (
    <section id="why-us" className="py-24 bg-[#0A1628] bg-grid relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-cyan/5 rounded-full filter blur-[100px] pointer-events-none"></div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-cyan font-accent text-sm font-semibold uppercase tracking-wider">The HOMMED Advantage</span>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Why Choose Our Homeopathy Centre?
          </h3>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            We provide a modern, patient-first healing environment centered on safety, efficacy, and permanent root-cause healing.
          </p>
        </div>
 
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={point.id}
              className="glass-card p-8 rounded-3xl bg-[#162847]/40 border border-white/8 hover:border-brand-cyan/30 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl w-fit mb-6 text-white">
                  {point.icon}
                </div>
                <h4 className="font-heading font-bold text-xl text-white mb-3">
                  {point.title}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
 
      </div>
    </section>
  );
}

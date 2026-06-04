'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, ShieldCheck, Sparkle, Activity } from 'lucide-react';
 
export default function WhyChoose() {
  const points = [
    {
      id: 1,
      icon: <HeartHandshake className="h-6 w-6 text-brand-blue" />,
      title: 'Sirf Aapke Liye Banaya Hua Ilaaj',
      desc: 'Koi ek jaisi dawai nahi. Aapki body, aapka itihas, aapka ilaaj.'
    },
    {
      id: 2,
      icon: <Sparkles className="h-6 w-6 text-brand-purple" />,
      title: 'Purani Homeopathy + Aaj Ki Diagnosis',
      desc: 'Modern tests ke saath classic constitutional therapy.'
    },
    {
      id: 3,
      icon: <ShieldCheck className="h-6 w-6 text-brand-green" />,
      title: 'Koi Chemical Nahi, Koi Toxin Nahi',
      desc: 'Har umra ke liye safe — bachche se lekar buzurg tak.'
    },
    {
      id: 4,
      icon: <Sparkle className="h-6 w-6 text-brand-cyan" />,
      title: 'Body Ko Dawai Ki Aadat Nahi Lagti',
      desc: 'Khud theek hone ki takat andar se jagaate hain.'
    },
    {
      id: 5,
      icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
      title: 'Kanpur Mein Clinic, Online Bhi Available',
      desc: 'Aap kahi se bhi call se bat karke Online Consultation le sakte hai.'
    },
    {
      id: 6,
      icon: <Activity className="h-6 w-6 text-brand-gold" />,
      title: 'Sirf Symptoms Nahi — Bimari Ki Jadd Khatam',
      desc: 'Isliye relief permanent hoti hai.'
    }
  ];
 
  return (
    <section id="why-us" className="reveal-on-scroll py-24 bg-[#0E1F12] bg-grid relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#4CAF6E]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#4CAF6E] font-accent text-sm font-semibold uppercase tracking-wider">The HOMMED Advantage</span>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Aur Clinics Se Alag Kyun Hai HOMMED?
          </h3>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Kyunki hum sirf dawai nahi dete — hum aapki poori body, mind aur history ko samajh ke ilaaj karte hain.
          </p>
        </div>
 
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={point.id}
              className="glass-card p-8 rounded-3xl bg-[#1C3A22]/40 border border-[#4CAF6E]/10 hover:border-[#4CAF6E]/30 flex flex-col justify-between"
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

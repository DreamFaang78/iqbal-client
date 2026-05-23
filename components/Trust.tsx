'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Animated Counter Hook ──────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── THEME-MATCHED ICONS ────────────────────────────────── */

const LeafIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7A0" />
        <stop offset="100%" stopColor="#2D7A3A" />
      </linearGradient>
    </defs>
    <path d="M10 38 C14 20 30 10 40 8 C40 8 42 28 26 36 C18 40 10 38 10 38Z" fill="url(#leafGrad)" opacity="0.9"/>
    <path d="M10 38 C16 30 24 22 40 8" stroke="#4CAF6E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
    <circle cx="38" cy="10" r="3" fill="#C8922A" opacity="0.8"/>
    <circle cx="38" cy="10" r="1.5" fill="#F5C842" opacity="0.9"/>
  </svg>
);

const HeartPulseIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7A0" />
        <stop offset="100%" stopColor="#4CAF6E" />
      </linearGradient>
    </defs>
    <path d="M24 40 C24 40 8 30 8 18 C8 13 12 9 17 9 C20 9 22 10.5 24 13 C26 10.5 28 9 31 9 C36 9 40 13 40 18 C40 30 24 40 24 40Z" fill="url(#heartGrad)" opacity="0.85"/>
    <polyline points="12,22 17,22 20,16 23,28 26,20 29,24 32,22 36,22" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
  </svg>
);

const StarFlowerIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5C842" />
        <stop offset="100%" stopColor="#C8922A" />
      </linearGradient>
    </defs>
    <path d="M24 6L27.5 18H40L30 25.5L33.5 38L24 31L14.5 38L18 25.5L8 18H20.5L24 6Z" fill="url(#goldGrad)" opacity="0.95"/>
    <path d="M24 10L26.8 19H36.4L28.8 24.3L31.6 33.3L24 28L16.4 33.3L19.2 24.3L11.6 19H21.2L24 10Z" fill="#F5C842" opacity="0.5"/>
    <circle cx="24" cy="24" r="4" fill="white" opacity="0.3"/>
  </svg>
);

const ShieldLeafIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7A0" />
        <stop offset="100%" stopColor="#2D7A3A" />
      </linearGradient>
    </defs>
    <path d="M24 4 L38 10 L38 24 C38 33 24 44 24 44 C24 44 10 33 10 24 L10 10 Z" fill="url(#shieldGrad)" opacity="0.85"/>
    <path d="M17 28 C19 18 28 13 34 12 C34 12 35 22 26 27 C22 29 17 28 17 28Z" fill="white" opacity="0.25"/>
    <path d="M17 28 C20 24 25 20 34 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <circle cx="33" cy="13" r="2" fill="#C8922A" opacity="0.9"/>
  </svg>
);

/* ─── STAT DATA ─────────────────────────────────────────── */
const STATS = [
  {
    id: 1,
    Icon: LeafIcon,
    target: 15,
    suffix: '+',
    label: 'Years of Experience',
    desc: 'Dedicated constitutional HOMOEOPATHY care',
    displayOverride: undefined as string | undefined,
    accentColor: '#4CAF6E',
    goldTint: false,
  },
  {
    id: 2,
    Icon: HeartPulseIcon,
    target: 10,
    suffix: 'k+',
    label: 'Patients Treated',
    desc: 'Chronic conditions healed naturally',
    displayOverride: undefined as string | undefined,
    accentColor: '#4CAF6E',
    goldTint: false,
  },
  {
    id: 3,
    Icon: StarFlowerIcon,
    target: 49,
    suffix: '★',
    label: 'Google Rating',
    desc: 'Top-rated clinic in Kanpur, UP',
    displayOverride: '4.9★',
    accentColor: '#C8922A',
    goldTint: true,
  },
  {
    id: 4,
    Icon: ShieldLeafIcon,
    target: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    desc: 'Verified patient wellness outcomes',
    displayOverride: undefined as string | undefined,
    accentColor: '#4CAF6E',
    goldTint: false,
  },
];

/* ─── STAT CARD ─────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(stat.target, 1800, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayValue = stat.displayOverride ?? `${count}${stat.suffix}`;
  const isGold = stat.goldTint;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="group relative"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-[28px] p-7 sm:p-8 flex flex-col items-center text-center h-full transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, rgba(28,58,34,0.7) 0%, rgba(14,31,18,0.85) 100%)',
          border: isGold
            ? '1px solid rgba(200,146,42,0.25)'
            : '1px solid rgba(76,175,110,0.18)',
          boxShadow: isGold
            ? '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(200,146,42,0.08)'
            : '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(76,175,110,0.06)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none"
          style={{
            background: isGold
              ? 'radial-gradient(circle at 50% 0%, rgba(200,146,42,0.12) 0%, transparent 65%)'
              : 'radial-gradient(circle at 50% 0%, rgba(76,175,110,0.1) 0%, transparent 65%)',
          }}
        />

        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-10 right-10 h-[1px] rounded-full"
          style={{
            background: isGold
              ? 'linear-gradient(90deg, transparent, rgba(200,146,42,0.6), rgba(245,200,66,0.8), rgba(200,146,42,0.6), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(76,175,110,0.5), rgba(110,231,160,0.7), rgba(76,175,110,0.5), transparent)',
          }}
        />

        {/* Icon container */}
        <div className="relative mb-6 z-10">
          {/* Glow ring */}
          <div
            className="absolute inset-0 -m-4 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isGold
                ? 'radial-gradient(circle, rgba(200,146,42,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(76,175,110,0.12) 0%, transparent 70%)',
            }}
          />
          <div
            className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{
              background: isGold
                ? 'linear-gradient(135deg, rgba(200,146,42,0.12) 0%, rgba(200,146,42,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(76,175,110,0.12) 0%, rgba(76,175,110,0.04) 100%)',
              border: isGold
                ? '1px solid rgba(200,146,42,0.22)'
                : '1px solid rgba(76,175,110,0.2)',
            }}
          >
            <stat.Icon />
          </div>
        </div>

        {/* Stat number */}
        <div
          className="font-heading font-extrabold text-5xl sm:text-6xl tracking-tight leading-none mb-3 z-10"
          style={{
            background: isGold
              ? 'linear-gradient(135deg, #F5C842 0%, #C8922A 100%)'
              : 'linear-gradient(135deg, #ffffff 10%, #6EE7A0 60%, #4CAF6E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {displayValue}
        </div>

        {/* Label */}
        <div className="font-heading font-bold text-sm sm:text-base text-white leading-snug mb-2 z-10">
          {stat.label}
        </div>

        {/* Desc */}
        <div className="text-white/45 text-xs leading-relaxed z-10">
          {stat.desc}
        </div>

        {/* Bottom bar on hover */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] w-0 group-hover:w-2/3 rounded-full transition-all duration-500"
          style={{
            background: isGold
              ? 'linear-gradient(90deg, #F5C842, #C8922A)'
              : 'linear-gradient(90deg, #4CAF6E, #6EE7A0)',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── MAIN SECTION ──────────────────────────────────────── */
export default function Trust() {
  return (
    <section className="py-20 relative overflow-hidden font-sans bg-[#132918]">

      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[340px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(76,175,110,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(200,146,42,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(45,122,58,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4CAF6E]/20 bg-[#4CAF6E]/8 text-[#4CAF6E] text-xs font-semibold tracking-[0.12em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF6E] animate-pulse" />
            Trusted By Thousands in Kanpur
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-4 tracking-tight leading-tight">
            HOMOEOPATHY Results That{' '}
            <span className="text-[#C8922A]">Speak For Themselves</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light mt-3 max-w-xl mx-auto leading-relaxed">
            Numbers that reflect 15+ years of dedicated, compassionate care rooted in the healing wisdom of natural medicine.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Decorative bottom leaf strip */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-12 opacity-40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#4CAF6E]/50" />
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4CAF6E]" fill="currentColor" opacity="0.6">
            <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22L7 19C7.5 19.2 7.97 19.28 8.5 19.28C13 19.28 18 14 18 7L17 8Z"/>
          </svg>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#4CAF6E]/50" />
        </motion.div>

      </div>
    </section>
  );
}

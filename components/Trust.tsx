'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Animated Counter Hook ──────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── SVG Icon Components ────────────────────────────────── */

// Caduceus / Medical experience icon
const ExperienceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <defs>
      <linearGradient id="expGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#00B4D8" />
      </linearGradient>
      <linearGradient id="expGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5C842" />
        <stop offset="100%" stopColor="#E4A900" />
      </linearGradient>
    </defs>
    {/* Staff */}
    <rect x="30" y="6" width="4" height="52" rx="2" fill="url(#expGrad)" opacity="0.9" />
    {/* Wings */}
    <path d="M32 18 C18 14 10 20 14 28 C18 36 30 30 32 26" stroke="url(#expGold)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M32 18 C46 14 54 20 50 28 C46 36 34 30 32 26" stroke="url(#expGold)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {/* Snake coil top */}
    <path d="M32 14 C26 10 22 16 28 20 C34 24 38 18 32 14" stroke="url(#expGrad)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Snake coil bottom */}
    <path d="M32 34 C26 30 22 36 28 40 C34 44 38 38 32 34" stroke="url(#expGrad)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Top star/gem */}
    <circle cx="32" cy="8" r="4" fill="url(#expGold)" />
    <circle cx="32" cy="8" r="2" fill="white" opacity="0.6" />
    {/* Base */}
    <rect x="25" y="56" width="14" height="3" rx="1.5" fill="url(#expGrad)" opacity="0.7" />
  </svg>
);

// Community / Patients icon
const PatientsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <defs>
      <linearGradient id="patGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5A0" />
        <stop offset="100%" stopColor="#00C97B" />
      </linearGradient>
      <linearGradient id="patCyan" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#00B4D8" />
      </linearGradient>
    </defs>
    {/* Center person (largest) */}
    <circle cx="32" cy="20" r="8" fill="url(#patGrad)" />
    <path d="M18 46 C18 36 46 36 46 46" stroke="url(#patGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    {/* Left person */}
    <circle cx="14" cy="24" r="5.5" fill="url(#patCyan)" opacity="0.85" />
    <path d="M4 46 C4 38 24 38 24 46" stroke="url(#patCyan)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85"/>
    {/* Right person */}
    <circle cx="50" cy="24" r="5.5" fill="url(#patCyan)" opacity="0.85" />
    <path d="M40 46 C40 38 60 38 60 46" stroke="url(#patCyan)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85"/>
    {/* Heart on center */}
    <path d="M29 19 C29 17 32 15.5 32 18.5 C32 15.5 35 17 35 19 C35 21 32 23 32 23 C32 23 29 21 29 19Z" fill="white" opacity="0.9"/>
  </svg>
);

// Star rating / Google icon
const RatingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <defs>
      <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#F5C842" />
        <stop offset="100%" stopColor="#E4A900" />
      </linearGradient>
      <linearGradient id="starGlow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#E4A900" stopOpacity="0" />
      </linearGradient>
      <filter id="starBlur">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    {/* Glow halo */}
    <circle cx="32" cy="30" r="22" fill="url(#starGlow)" />
    {/* Main star */}
    <path
      d="M32 8L37.5 24H55L41.5 34L47 50L32 40L17 50L22.5 34L9 24H26.5L32 8Z"
      fill="url(#starGrad)"
      filter="url(#starBlur)"
    />
    {/* Inner highlight */}
    <path
      d="M32 14L35.8 25.6H48.2L38.2 32.4L42 44L32 37.2L22 44L25.8 32.4L15.8 25.6H28.2L32 14Z"
      fill="url(#starGrad)"
    />
    {/* Shine on star */}
    <path d="M32 14L34 22L29 19Z" fill="white" opacity="0.5"/>
    {/* Small orbiting stars */}
    <circle cx="10" cy="14" r="2.5" fill="#F5C842" opacity="0.7"/>
    <circle cx="54" cy="10" r="2" fill="#E4A900" opacity="0.6"/>
    <circle cx="56" cy="48" r="3" fill="#FFD700" opacity="0.5"/>
  </svg>
);

// Pulse / Recovery icon
const RecoveryIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <defs>
      <linearGradient id="recGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#00B4D8" />
      </linearGradient>
      <linearGradient id="recGreen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00E5A0" />
        <stop offset="100%" stopColor="#00C97B" />
      </linearGradient>
    </defs>
    {/* Circle base */}
    <circle cx="32" cy="32" r="26" stroke="url(#recGrad)" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="4 3"/>
    {/* ECG / heartbeat pulse line */}
    <polyline
      points="6,36 16,36 21,22 26,44 31,28 36,40 41,32 46,36 58,36"
      stroke="url(#recGreen)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Heart inside */}
    <path
      d="M32 46 C32 46 20 38 20 30 C20 25.5 23.5 22 28 22 C29.8 22 31.5 22.8 32 24 C32.5 22.8 34.2 22 36 22 C40.5 22 44 25.5 44 30 C44 38 32 46 32 46Z"
      fill="url(#recGreen)"
      opacity="0.9"
    />
    {/* Shine on heart */}
    <path d="M27 27C27.5 25 30 24 31 25.5 C29 25.5 27.5 27.5 27 27Z" fill="white" opacity="0.6"/>
    {/* Pulse dot */}
    <circle cx="41" cy="32" r="3.5" fill="url(#recGrad)" />
    <circle cx="41" cy="32" r="2" fill="white" opacity="0.7"/>
  </svg>
);

/* ─── STAT DATA ──────────────────────────────────────────── */
const STATS = [
  {
    id: 1,
    Icon: ExperienceIcon,
    target: 15,
    suffix: '+',
    label: 'Years of Experience',
    desc: 'Expert homeopathic consultant',
    accentFrom: '#00E5FF',
    accentTo: '#00B4D8',
    borderColor: 'rgba(0,180,216,0.22)',
    glowColor: 'rgba(0,180,216,0.15)',
    ringColor: 'rgba(0,180,216,0.12)',
  },
  {
    id: 2,
    Icon: PatientsIcon,
    target: 10,
    suffix: 'k+',
    label: 'Patients Treated',
    desc: 'Successful chronic recoveries',
    accentFrom: '#00E5A0',
    accentTo: '#00C97B',
    borderColor: 'rgba(0,201,123,0.22)',
    glowColor: 'rgba(0,201,123,0.12)',
    ringColor: 'rgba(0,201,123,0.10)',
  },
  {
    id: 3,
    Icon: RatingIcon,
    target: 49,
    suffix: '★',
    label: 'Google Review Score',
    desc: 'Top-rated clinic in Kanpur',
    accentFrom: '#FFD700',
    accentTo: '#E4A900',
    borderColor: 'rgba(228,169,0,0.25)',
    glowColor: 'rgba(228,169,0,0.12)',
    ringColor: 'rgba(228,169,0,0.10)',
    displayOverride: '4.9★',
  },
  {
    id: 4,
    Icon: RecoveryIcon,
    target: 99,
    suffix: '%',
    label: 'Recovery Rate',
    desc: 'Clinically proven results',
    accentFrom: '#00E5FF',
    accentTo: '#00B4D8',
    borderColor: 'rgba(0,180,216,0.22)',
    glowColor: 'rgba(0,180,216,0.12)',
    ringColor: 'rgba(0,180,216,0.10)',
  },
];

/* ─── SINGLE STAT CARD ──────────────────────────────────── */
function StatCard({
  stat,
  index,
}: {
  stat: typeof STATS[0];
  index: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(stat.target, 1600, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayValue = stat.displayOverride
    ? stat.displayOverride
    : `${count}${stat.suffix}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="relative group cursor-default"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-3xl p-7 flex flex-col items-center text-center h-full transition-all duration-400"
        style={{
          background: 'linear-gradient(145deg, rgba(13,31,58,0.95) 0%, rgba(10,22,40,0.98) 100%)',
          border: `1px solid ${stat.borderColor}`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Hover glow bg */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{ background: `radial-gradient(circle at 50% 20%, ${stat.glowColor} 0%, transparent 70%)` }}
        />

        {/* Top gradient line */}
        <div
          className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.accentFrom}, ${stat.accentTo}, transparent)` }}
        />

        {/* Icon area with glow ring */}
        <div className="relative mb-6 z-10">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 -m-3 rounded-full animate-pulse-slow"
            style={{ background: `radial-gradient(circle, ${stat.ringColor} 0%, transparent 70%)` }}
          />
          {/* Icon background circle */}
          <div
            className="relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${stat.borderColor}`,
              boxShadow: `0 4px 20px ${stat.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            {/* Corner dots decoration */}
            <div
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full opacity-60"
              style={{ background: stat.accentFrom }}
            />
            <div
              className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full opacity-40"
              style={{ background: stat.accentTo }}
            />
            <stat.Icon />
          </div>
        </div>

        {/* Stat number */}
        <div
          className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight leading-none mb-3 z-10"
          style={{
            background: `linear-gradient(135deg, #ffffff 30%, ${stat.accentFrom} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {displayValue}
        </div>

        {/* Label */}
        <div className="font-heading font-bold text-sm sm:text-base text-white/90 leading-snug mb-1.5 z-10">
          {stat.label}
        </div>

        {/* Desc */}
        <div className="text-white/40 text-xs leading-relaxed z-10">
          {stat.desc}
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/4 rounded-full transition-all duration-500"
          style={{ background: `linear-gradient(90deg, ${stat.accentFrom}, ${stat.accentTo})` }}
        />
      </div>
    </motion.div>
  );
}

/* ─── MAIN SECTION ──────────────────────────────────────── */
export default function Trust() {
  return (
    <section className="py-20 relative overflow-hidden font-sans" style={{ background: '#0D1F3A' }}>

      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,180,216,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(228,169,0,0.06) 0%, transparent 70%)' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section label */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/6 text-[#00B4D8] text-xs font-semibold tracking-[0.12em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
            Trusted By Thousands
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-4 tracking-tight">
            Numbers That{' '}
            <span className="text-[#E4A900]">Speak For Themselves</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

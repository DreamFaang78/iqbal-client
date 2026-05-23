'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Bot, ShieldCheck, TrendingUp, Leaf, Star } from 'lucide-react';

/* ─── animation presets ─────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 20 },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: 0.2 },
  },
};

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[#0E1F12] pb-24 md:pb-0 md:min-h-[92vh]">

      {/* ── BACKGROUND GLOWS ─────────────────────────── */}
      <div className="absolute top-0 right-0 w-[700px] h-[500px] blob-cyan opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] blob-gold opacity-35 pointer-events-none" />
      {/* Herb leaf decorative SVG */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-5 pointer-events-none select-none" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20 C60 20 20 60 20 100 C20 140 60 180 100 180 C140 180 100 140 100 100 C100 60 140 20 100 20Z" fill="#4CAF6E" />
          <path d="M100 20 L100 180" stroke="#6DD98C" strokeWidth="3" />
          <path d="M100 60 C80 50 60 55 50 70" stroke="#6DD98C" strokeWidth="2" />
          <path d="M100 80 C120 70 140 75 150 90" stroke="#6DD98C" strokeWidth="2" />
          <path d="M100 110 C80 100 60 105 50 120" stroke="#6DD98C" strokeWidth="2" />
        </svg>
      </div>
      {/* subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-8 pb-10 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ════════════════════════════════════════════
              LEFT COLUMN — COPY + CTAs
          ════════════════════════════════════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            {/* Pre-label badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4CAF6E]/35 bg-[#4CAF6E]/10 text-[#4CAF6E] text-xs font-semibold tracking-[0.12em] uppercase">
                <Leaf className="h-3.5 w-3.5" />
                An Advanced Homoeopathic Clinic · Kanpur
              </div>
            </motion.div>

            {/* Main Headline — Hinglish, pain-first */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-extrabold leading-[1.08] tracking-tight"
            >
              <span className="block text-white text-4xl sm:text-5xl lg:text-[56px]">
                Thak Gaye Baar Baar
              </span>
              <span className="block text-[#C8922A] text-4xl sm:text-5xl lg:text-[56px] mt-1">
                Dawaiyaan Badalne
              </span>
              <span className="block text-white text-4xl sm:text-5xl lg:text-[56px]">
                Se?
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-base sm:text-[17px] leading-relaxed max-w-[480px]"
            >
              Hamari HOMOEOPATHY Treatment Karta Hai Rog Ko Jadd Se
              Khatam — Bina Side Effects Ke. Kanpur Ke Sabse Bharosemand Homoeopathic Centre.
            </motion.p>

            {/* Pain Point Chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              {[
                { icon: '🌿', label: 'Skin Problems' },
                { icon: '🌿', label: 'Hair Fall' },
                { icon: '🌿', label: 'Chronic Allergy' },
                { icon: '🌿', label: 'Joint & Arthritis' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4CAF6E]/20 bg-[#4CAF6E]/8 text-white/75 text-sm font-medium backdrop-blur-sm"
                >
                  <span className="text-xs">{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-1">
              {/* Gold Primary CTA */}
              <Link
                href="/book"
                className="btn-gold flex items-center justify-center gap-2.5 px-7 h-14 rounded-2xl text-sm font-bold shadow-[0_4px_24px_rgba(228,169,0,0.4)] hover:shadow-[0_6px_32px_rgba(228,169,0,0.55)] transition-all"
              >
                <Calendar className="h-4.5 w-4.5 shrink-0" />
                FREE Consultation Book Karein
              </Link>

              {/* Dark glass secondary CTA */}
              <button className="flex items-center justify-center gap-2.5 px-7 h-14 rounded-2xl text-sm font-semibold text-white bg-[#1C3A22] border border-[#4CAF6E]/20 hover:bg-[#243D28] hover:border-[#4CAF6E]/45 transition-all">
                <Bot className="h-4.5 w-4.5 text-[#4CAF6E] shrink-0" />
                AI Health Assistant
              </button>
            </motion.div>

            {/* WhatsApp link */}
            <motion.div variants={fadeUp}>
              <a
                href="https://wa.me/918707868504"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#3DAA58] text-sm font-medium hover:underline underline-offset-2 transition-all"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp pe seedha baat karein →
              </a>
            </motion.div>

            {/* Stat counters */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-4 gap-4 pt-4 border-t border-white/8 max-w-lg"
            >
              {[
                { value: '15+', label: 'Years Exp.' },
                { value: '10K+', label: 'Patients' },
                { value: '4.9★', label: 'Google Rating' },
                { value: '98%', label: 'Success Rate' },
              ].map((s) => (
                <div key={s.label} className="text-left">
                  <div className="text-white font-heading font-bold text-xl">{s.value}</div>
                  <div className="text-white/45 text-[11px] mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ════════════════════════════════════════════
              RIGHT COLUMN — DOCTOR CARD
          ════════════════════════════════════════════ */}
          <motion.div
            variants={slideIn}
            initial="hidden"
            animate="show"
            className="relative flex justify-center items-center h-[480px] lg:h-[540px] mt-4 lg:mt-0"
          >

            {/* ── MAIN DOCTOR CARD ── */}
            <div className="relative w-[300px] sm:w-[320px] h-[460px] sm:h-[500px] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/8">
              {/* Doctor photo */}
              <img
                src="/doctor-iqbal.jpg"
                alt="Dr. Iqbal — Homeopathic Physician"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* Gradient overlay — heavy at bottom for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080F0A] via-[#0E1F12]/20 to-transparent" />

              {/* ── AVAILABLE TODAY badge (top-right) ── */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E1F12]/80 backdrop-blur-md border border-[#4CAF6E]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#3DAA58] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DAA58]" />
                </span>
                <span className="text-[11px] text-white/90 font-medium">Available Today</span>
              </div>

              {/* ── VERIFIED SPECIALIST badge (bottom-center) ── */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E1F12]/90 backdrop-blur-md border border-[#4CAF6E]/25">
                <Star className="h-4 w-4 text-[#C8922A] fill-[#C8922A]" />
                <span className="text-xs text-white font-semibold tracking-[0.08em] uppercase">Verified HOMOEOPATHY Specialist</span>
              </div>
            </div>

            {/* ── FLOATING BADGE 1 — 100% Safe (left) ── */}
            <motion.div
              className="absolute top-[22%] -left-4 sm:-left-10 glass-badge rounded-2xl px-4 py-3 flex items-center gap-3 animate-float z-20 shadow-premium"
              style={{ animationDuration: '6s' }}
            >
              <div className="p-2 rounded-xl bg-[#4CAF6E]/15 border border-[#4CAF6E]/20">
                <ShieldCheck className="h-5 w-5 text-[#4CAF6E]" />
              </div>
              <div>
                <p className="text-[10px] text-white/45 font-medium uppercase tracking-wider leading-none mb-0.5">100% Safe</p>
                <p className="text-sm text-white font-semibold leading-none">Natural Medicine</p>
              </div>
            </motion.div>

            {/* ── FLOATING BADGE 2 — 99% Proven (right) ── */}
            <motion.div
              className="absolute bottom-[22%] -right-4 sm:-right-10 glass-badge rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-delayed z-20 shadow-premium"
              style={{ animationDuration: '7s' }}
            >
              <div className="p-2 rounded-xl bg-[#3DAA58]/15 border border-[#3DAA58]/20">
                <TrendingUp className="h-5 w-5 text-[#3DAA58]" />
              </div>
              <div>
                <p className="text-[10px] text-white/45 font-medium uppercase tracking-wider leading-none mb-0.5">99% Proven</p>
                <p className="text-sm text-white font-semibold leading-none">Recovery Rate</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ── MOBILE-ONLY STICKY CTA BAR ─────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-[#0E1F12] via-[#0E1F12]/95 to-transparent">
        <div className="flex gap-3">
          {/* Primary — Book Appointment (continuously animated) */}
          <div className="relative flex-1">
            <a
              href="/book"
              className="relative w-full h-13 flex items-center justify-center gap-2 rounded-2xl overflow-hidden font-bold text-sm text-[#0E1F12] active:scale-[0.97]"
              style={{ background: 'linear-gradient(110deg, #C8922A 0%, #F5C842 45%, #E8A82A 100%)' }}
            >
              {/* Auto-running shimmer sweep */}
              <span className="animate-shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
              <Calendar className="h-4 w-4 shrink-0 relative z-10 drop-shadow-sm" />
              <span className="tracking-wide relative z-10 drop-shadow-sm">Book Appointment</span>
            </a>
          </div>
          {/* Secondary — Call */}
          <a
            href="tel:8707868504"
            className="relative flex items-center justify-center gap-2 px-4 h-13 rounded-2xl border border-[#4CAF6E]/40 bg-[#4CAF6E]/10 text-[#4CAF6E] font-semibold text-sm active:scale-[0.97] transition-transform shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.77A16 16 0 0 0 14 15l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Call Now</span>
          </a>
        </div>
      </div>

    </section>
  );
}

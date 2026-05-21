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
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0A1628]">

      {/* ── BACKGROUND GLOWS ─────────────────────────── */}
      <div className="absolute top-0 right-0 w-[700px] h-[500px] blob-cyan opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] blob-gold opacity-40 pointer-events-none" />
      {/* subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-16 lg:py-24">
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
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/8 text-[#00B4D8] text-xs font-semibold tracking-[0.12em] uppercase">
                <Leaf className="h-3.5 w-3.5" />
                Natural • Safe • Permanent
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
              <span className="block text-[#E4A900] text-4xl sm:text-5xl lg:text-[56px] mt-1">
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
              Humara Homeopathic Treatment Karta Hai Rog Ko Jadd Se
              Khatam — Bina Side Effects Ke.
            </motion.p>

            {/* Pain Point Chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              {[
                { icon: '✗', label: 'Skin Problems' },
                { icon: '✗', label: 'Hair Fall' },
                { icon: '✗', label: 'Chronic Allergy' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/12 bg-white/5 text-white/70 text-sm font-medium backdrop-blur-sm"
                >
                  <span className="text-[#00B4D8] text-xs">{tag.icon}</span>
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
              <button className="flex items-center justify-center gap-2.5 px-7 h-14 rounded-2xl text-sm font-semibold text-white bg-[#162847] border border-white/12 hover:bg-[#1e3260] hover:border-[#00B4D8]/40 transition-all">
                <Bot className="h-4.5 w-4.5 text-[#00B4D8] shrink-0" />
                AI Health Assistant
              </button>
            </motion.div>

            {/* WhatsApp link */}
            <motion.div variants={fadeUp}>
              <a
                href="https://wa.me/918756124708"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00C97B] text-sm font-medium hover:underline underline-offset-2 transition-all"
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#060E1A] via-[#0A1628]/20 to-transparent" />

              {/* ── AVAILABLE TODAY badge (top-right) ── */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A1628]/80 backdrop-blur-md border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#00C97B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C97B]" />
                </span>
                <span className="text-[11px] text-white/90 font-medium">Available Today</span>
              </div>

              {/* ── VERIFIED SPECIALIST badge (bottom-center) ── */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1628]/90 backdrop-blur-md border border-[#00B4D8]/25">
                <Star className="h-4 w-4 text-[#E4A900] fill-[#E4A900]" />
                <span className="text-xs text-white font-semibold tracking-[0.08em] uppercase">Verified Specialist</span>
              </div>
            </div>

            {/* ── FLOATING BADGE 1 — 100% Safe (left) ── */}
            <motion.div
              className="absolute top-[22%] -left-4 sm:-left-10 glass-badge rounded-2xl px-4 py-3 flex items-center gap-3 animate-float z-20 shadow-premium"
              style={{ animationDuration: '6s' }}
            >
              <div className="p-2 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20">
                <ShieldCheck className="h-5 w-5 text-[#00B4D8]" />
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
              <div className="p-2 rounded-xl bg-[#00C97B]/15 border border-[#00C97B]/20">
                <TrendingUp className="h-5 w-5 text-[#00C97B]" />
              </div>
              <div>
                <p className="text-[10px] text-white/45 font-medium uppercase tracking-wider leading-none mb-0.5">99% Proven</p>
                <p className="text-sm text-white font-semibold leading-none">Recovery Rate</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

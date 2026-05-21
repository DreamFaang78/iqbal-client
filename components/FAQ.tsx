'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { DEFAULT_FAQS } from '@/lib/data';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#060E1A] relative overflow-hidden font-sans">
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00B4D8]/8 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#00B4D8] font-accent text-sm font-semibold uppercase tracking-wider">Common Questions</span>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-white/55 text-sm sm:text-base font-light">
            Clear, honest answers about homeopathy, consultation procedures, and treatment guidelines.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {DEFAULT_FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#00B4D8]/25"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-white pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${isOpen ? 'bg-[#00B4D8]/15 text-[#00B4D8]' : 'bg-white/6 text-white/40'}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-6 sm:px-6 text-white/55 text-sm leading-relaxed border-t border-white/6 pt-4 font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

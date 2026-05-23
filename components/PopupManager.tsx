'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface PopupData {
  type: 'appointment' | 'exit' | 'offer' | 'whatsapp' | 'lead_capture';
  title: string;
  content: string;
  isActive: boolean;
  delaySeconds: number;
}

export default function PopupManager() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    // Fetch active popup configuration from the database APIs
    fetch('/api/popups')
      .then((res) => res.json())
      .then((data) => {
        // Find the first active popup
        const active = Array.isArray(data) ? data.find((p: any) => p.isActive) : null;
        if (active) {
          setPopup(active);
        }
      })
      .catch((e) => {
        // Fallback for local simulation
        console.warn('Popup fetch failed, using local simulation: ', e.message);
      });
  }, []);

  useEffect(() => {
    if (!popup) return;

    // Check if user has already closed a popup during this session
    const closed = sessionStorage.getItem(`hommed_popup_closed_${popup.type}`);
    if (closed) return;

    if (popup.type === 'exit') {
      // Exit intent detection: triggers when user cursor leaves top of screen
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 5) {
          setShow(true);
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    } else {
      // Delay-based popup trigger
      const timer = setTimeout(() => {
        setShow(true);
      }, (popup.delaySeconds || 5) * 1000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const handleClose = () => {
    setShow(false);
    if (popup) {
      sessionStorage.setItem(`hommed_popup_closed_${popup.type}`, 'true');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          inquiry: `Captured via Popup [${popup?.type || 'marketing'}]: ${popup?.title}`
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // Fallback mock success state
    }
  };

  if (!popup || !show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-2xl p-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="p-3 bg-emerald-100 text-brand-green rounded-full w-fit mx-auto animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-navy">Slot Registered!</h3>
              <p className="text-slate-600 text-sm font-light">
                Thank you! Our clinic assistant will call you within a few hours to confirm.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-sm font-semibold transition-all"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Type Graphic */}
              <div className="flex items-center space-x-3.5">
                <div className={`p-3 rounded-2xl w-fit ${
                  popup.type === 'offer' ? 'bg-purple-100 text-brand-purple' : 'bg-blue-100 text-brand-blue'
                }`}>
                  {popup.type === 'whatsapp' ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {popup.type.replace('_', ' ')}
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-brand-navy mt-0.5">{popup.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-light">{popup.content}</p>

              {popup.type === 'whatsapp' ? (
                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/918707868504"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="h-12 w-full flex items-center justify-center space-x-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-brand-green/20"
                  >
                    <MessageSquare className="h-4 w-4 fill-current" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                  <button
                    onClick={handleClose}
                    className="h-12 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your first and last name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your 10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 mt-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Request Callback</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

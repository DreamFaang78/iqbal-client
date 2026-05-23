'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', inquiry: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.inquiry) {
      setError('Please fill in Name, Phone, and Inquiry.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', inquiry: '' });
    } catch (err: any) {
      setError(err.message || 'Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0E1F12] bg-grid relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-blue/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-cyan font-accent text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Book Your HOMOEOPATHY Consultation
          </h3>
          <p className="text-slate-300 text-base sm:text-lg font-light">
            Fill out the form below for HOMOEOPATHY consultation queries or reach out directly via WhatsApp. Serving Kanpur & surrounding areas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Details & Maps */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-6 bg-[#1C3A22]/50 border border-[#4CAF6E]/15 rounded-3xl space-y-3">
                <div className="p-2.5 bg-[#4CAF6E]/10 text-[#4CAF6E] border border-[#4CAF6E]/20 rounded-xl w-fit">
                  <Phone className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-white">Call Directly</h4>
                <a href="tel:+918707868504" className="text-slate-300 hover:text-[#4CAF6E] transition-colors text-sm font-semibold">
                  +91 87078 68504
                </a>
                <p className="text-slate-400 text-xs">Mon-Sat, 10am to 8pm</p>
              </div>

              <div className="p-6 bg-[#1C3A22]/50 border border-[#4CAF6E]/15 rounded-3xl space-y-3">
                <div className="p-2.5 bg-[#3DAA58]/10 text-[#3DAA58] border border-[#3DAA58]/20 rounded-xl w-fit">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-white">WhatsApp Support</h4>
                <a 
                  href="https://wa.me/918707868504" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#3DAA58] transition-colors text-sm font-semibold"
                >
                  Start WhatsApp Chat
                </a>
                <p className="text-slate-400 text-xs">Quick HOMOEOPATHY consultation support</p>
              </div>
            </div>

            <div className="p-6 bg-[#1C3A22]/50 border border-[#4CAF6E]/15 rounded-3xl flex items-start space-x-4">
              <div className="p-2.5 bg-[#C8922A]/10 text-[#C8922A] border border-[#C8922A]/20 rounded-xl shrink-0 mt-0.5">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-white">Clinic Location</h4>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  Dr. IQBAL'S Homeopathy CENTRE, Swaroop Nagar / Kidwai Nagar, Kanpur, Uttar Pradesh, India
                </p>
                <p className="text-slate-400 text-xs">(Please refer to coordinates on maps below)</p>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-sm h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.226888439498!2d80.3013233!3d26.4806871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c381ad7983637%3A0xc316719128f731cc!2sDr%20IQBAL&#39;S%20Homeopathy%20CENTRE!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#132918]/70 border border-[#4CAF6E]/15 rounded-[32px] p-8 sm:p-10 shadow-sm relative">
              
              {submitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="p-4 bg-emerald-500/10 text-brand-green border border-brand-green/20 rounded-full w-fit mx-auto animate-bounce">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white">Inquiry Received!</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto font-light">
                    Thank you for connecting with HOMMED. Dr. Iqbal's team will contact you on your phone number shortly to schedule your consultation.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#162847]/80 hover:bg-[#162847] border border-white/10 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-heading text-2xl font-extrabold text-white">Quick Consultation Request</h3>
                    <p className="text-slate-400 text-xs font-light">Enter details below to submit a priority lead to the clinic dashboard.</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full h-12 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-semibold text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 99999 88888"
                        className="w-full h-12 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-300">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full h-12 px-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="inquiry" className="text-xs font-semibold text-slate-300">Brief Symptoms / Inquiry *</label>
                    <textarea
                      name="inquiry"
                      id="inquiry"
                      required
                      value={formData.inquiry}
                      rows={4}
                      onChange={handleChange}
                      placeholder="Explain your skin, hair, or chronic allergies concerns..."
                      className="w-full p-4 bg-[#162847]/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 btn-gold rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Consultation Query</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

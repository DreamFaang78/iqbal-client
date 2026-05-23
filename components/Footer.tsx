import React from 'react';
import Link from 'next/link';
import { Activity, Phone, Mail, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080F0A] text-white/50 font-sans mt-auto">
      {/* Top Banner with Quick Connect */}
      <div className="border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg font-heading">Need Instant Consultation?</h3>
              <p className="text-slate-400 text-sm mt-1">Connect with Dr. Iqbal directly on WhatsApp for wellness guidance.</p>
            </div>
            <a
              href="https://wa.me/918707868504"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-[#3DAA58] hover:bg-[#2D7A3A] text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-800/30"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block hover:scale-[1.03] transition-transform duration-300">
              <img src="/logo.png" alt="HomMed Logo" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed">
              Dr. IQBAL'S Homoeopathy Centre (HOMMED) — An Advanced Homoeopathic Clinic offering premium, personalized HOMOEOPATHY treatments for the people of Kanpur, Uttar Pradesh.
            </p>
            <div className="text-sm">
              <span className="text-white font-semibold block">Consultation Hours:</span>
              <span>Mon - Sat: 10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM</span>
            </div>
          </div>

          {/* Treatment Areas */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-6">Our Services</h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { name: 'Skin Disorders', slug: 'skin-disorders' },
                { name: 'Hair Fall & Alopecia', slug: 'hair-fall' },
                { name: 'Allergy & Asthma', slug: 'allergy-treatment' },
                { name: 'Migraine Treatment', slug: 'migraine' },
                { name: 'PCOS & Women Care', slug: 'pcos' },
                { name: 'Digestive Health', slug: 'digestive-issues' }
              ].map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-6">Quick Links</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/book" className="hover:text-white transition-colors">Book Appointment</Link>
              </li>
              <li>
                <Link href="/#doctor" className="hover:text-white transition-colors">Doctor Profile</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Healthcare Blog</Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">FAQ Panel</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Patient Login</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <span>Dr. IQBAL'S Homeopathy Centre, Kanpur, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <a href="tel:+918707868504" className="hover:text-white transition-colors">+91 87078 68504</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <a href="mailto:info@hommed.in" className="hover:text-white transition-colors">info@hommed.in</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#1C3A22] bg-[#080F0A] py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-slate-500">
          <div>
            &copy; {currentYear} HOMMED — An Advanced Homoeopathic Clinic. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

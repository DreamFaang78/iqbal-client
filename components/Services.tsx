'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { DEFAULT_SERVICES, ServiceData } from '@/lib/data';

// Helper component to render Lucide icon dynamically by string name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  // Safe lookup: fallback to Activity if icon not found
  const IconComponent = (Icons as any)[name] || Icons.Activity;
  return <IconComponent className={className} />;
};

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>(DEFAULT_SERVICES);

  useEffect(() => {
    // Attempt to load services from the backend API, fallback to default seed data if it fails
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch((err) => {
        console.warn('Using default services fallback due to:', err.message);
      });
  }, []);

  return (
    <section id="services" className="py-24 bg-[#132918] relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#4CAF6E]/6 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8922A]/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-accent text-[#4CAF6E] font-bold text-sm uppercase tracking-wider">Our Specializations</h2>
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Kaunsi Bimari Mein Hum Kar Sakte Hain <span className="text-[#C8922A]">HOMOEOPATHY Se Ilaaj?</span>
          </h3>
          <p className="text-white/55 text-base sm:text-lg font-light leading-relaxed">
            Targeted natural recovery programs designed to stimulate constitutional healing for chronic, acute, and lifestyle ailments.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              className="glass-card flex flex-col justify-between p-7 rounded-3xl hover:border-[#4CAF6E]/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index % 4 * 0.1 }}
            >
              <div>
                {/* Icon Container */}
                <div className="p-3.5 bg-[#4CAF6E]/12 text-[#4CAF6E] rounded-2xl w-fit mb-6 border border-[#4CAF6E]/15">
                  <DynamicIcon name={service.icon} className="h-6 w-6" />
                </div>
                
                {/* Content */}
                <h4 className="font-heading font-bold text-xl text-white mb-3">
                  {service.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed mb-6 font-light">
                  {service.shortDescription}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-auto">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-semibold text-[#4CAF6E] hover:text-white flex items-center group/link transition-colors"
                >
                  Learn More
                  <Icons.ArrowRight className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href={`/book?service=${encodeURIComponent(service.title)}`}
                  className="px-3.5 py-1.5 bg-white/8 hover:bg-[#4CAF6E] hover:text-[#0E1F12] text-white/70 text-xs font-medium rounded-xl transition-all border border-white/10"
                >
                  Book Slot
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
export { DynamicIcon };

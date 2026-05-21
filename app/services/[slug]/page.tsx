'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';
import { DEFAULT_SERVICES, ServiceData } from '@/lib/data';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.Activity;
  return <IconComponent className={className} />;
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServicePage({ params }: PageProps) {
  // Resolve params using React.use() to conform to Next.js standards
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt API fetch
    fetch(`/api/services?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Fail');
        return res.json();
      })
      .then((data) => {
        if (data && data.title) {
          setService(data);
        } else {
          // Attempt local lookup in static list
          const found = DEFAULT_SERVICES.find((s) => s.slug === slug);
          if (found) setService(found);
        }
      })
      .catch(() => {
        // Fallback local lookup
        const found = DEFAULT_SERVICES.find((s) => s.slug === slug);
        if (found) setService(found);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <span className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!service) {
    notFound();
  }

  // Sidebar other services filter
  const otherServices = DEFAULT_SERVICES.filter((s) => s.slug !== slug).slice(0, 5);

  return (
    <div className="bg-slate-50 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/#services" 
          className="inline-flex items-center space-x-1.5 text-sm text-slate-500 hover:text-brand-blue font-medium mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Specializations</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full filter blur-3xl"></div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3.5 bg-blue-50 text-brand-blue rounded-2xl">
                  <DynamicIcon name={service.icon} className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Clinical Specialization</span>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-navy mt-1">
                    {service.title} Treatment
                  </h1>
                </div>
              </div>

              <p className="text-slate-700 text-lg leading-relaxed font-light">
                {service.detailedDescription}
              </p>
            </div>

            {/* Symptoms & Treatments Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Symptoms Panel */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-brand-navy mb-6 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                  <span>Common Symptoms We Treat</span>
                </h3>
                <ul className="space-y-4">
                  {service.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm font-light">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 shrink-0"></span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatments Panel */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-brand-navy mb-6 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-brand-green rounded-full"></span>
                  <span>Homeopathic Care Plan</span>
                </h3>
                <ul className="space-y-4">
                  {service.treatments.map((treatment, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm font-light">
                      <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Recovery Trust Banner */}
            <div className="bg-gradient-to-tr from-brand-navy to-slate-800 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-heading font-bold text-xl">Looking for Permanent Relief?</h3>
                <p className="text-slate-300 text-sm font-light max-w-md leading-relaxed">
                  Avoid continuous dependency on suppressive drugs. Opt for our constitutional clinical remedies.
                </p>
              </div>
              <Link 
                href={`/book?service=${encodeURIComponent(service.title)}`}
                className="h-12 px-6 flex items-center justify-center space-x-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold transition-all shadow-md shrink-0"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Priority Appointment</span>
              </Link>
            </div>

          </div>

          {/* Sidebar Navigation Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Appointment Consultation Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-brand-blue rounded-xl">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-navy">Consult Dr. Iqbal</h3>
              </div>
              
              <p className="text-slate-600 text-xs leading-normal font-light">
                Get an in-depth diagnosis of your physical and psychological medical history. Start your road to natural recovery.
              </p>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold text-brand-navy">In-Clinic / Online Consult</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-brand-navy">Kanpur, UP</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Slot fee:</span>
                  <span className="font-semibold text-brand-green">₹300 Only</span>
                </div>
              </div>

              <Link
                href={`/book?service=${encodeURIComponent(service.title)}`}
                className="h-12 w-full flex items-center justify-center bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
              >
                Schedule Consultation
              </Link>
            </div>

            {/* Sidebar list of other treatments */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-brand-navy mb-4">Other Specializations</h3>
              <ul className="space-y-3">
                {otherServices.map((other) => (
                  <li key={other.slug}>
                    <Link 
                      href={`/services/${other.slug}`}
                      className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl flex items-center justify-between text-xs text-slate-600 hover:text-brand-blue font-medium transition-all group"
                    >
                      <span>{other.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

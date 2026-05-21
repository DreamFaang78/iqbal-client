'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { DEFAULT_BLOGS, BlogData } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  // Resolve params using React.use() to conform to Next.js standards
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt API fetch
    fetch(`/api/blogs?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Fail');
        return res.json();
      })
      .then((data) => {
        if (data && data.title) {
          setBlog(data);
        } else {
          // Attempt local fallback
          const found = DEFAULT_BLOGS.find((b) => b.slug === slug);
          if (found) setBlog(found);
        }
      })
      .catch(() => {
        // Fallback local lookup
        const found = DEFAULT_BLOGS.find((b) => b.slug === slug);
        if (found) setBlog(found);
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

  if (!blog) {
    notFound();
  }

  // Sidebar recent posts
  const otherPosts = DEFAULT_BLOGS.filter((b) => b.slug !== slug).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center space-x-1.5 text-sm text-slate-500 hover:text-brand-blue font-medium mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white border border-slate-100 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-8">
            
            {/* Meta Tags */}
            <div className="space-y-4">
              <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-brand-blue text-[10px] font-bold uppercase tracking-wider">
                {blog.category}
              </span>
              
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-brand-navy leading-tight tracking-tight">
                {blog.title}
              </h1>

              {/* Author & Date info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-100 pb-6 pt-2">
                <span className="flex items-center space-x-1">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 font-semibold">{blog.author}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </span>
              </div>
            </div>

            {/* Content html injection */}
            <div 
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light text-base space-y-5
                         prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-navy
                         prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                         prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Disclaimer */}
            <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-amber-700 font-light mt-12 leading-relaxed">
              <strong>Medical Disclaimer:</strong> The information in this article is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult a qualified homeopathic physician regarding your symptoms.
            </div>

          </article>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Quick Consultation CTA */}
            <div className="bg-gradient-to-tr from-brand-navy via-slate-800 to-slate-900 rounded-3xl p-6 text-white space-y-6">
              <div className="p-3 bg-white/10 rounded-2xl w-fit border border-white/5">
                <BookOpen className="h-6 w-6 text-brand-cyan" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-lg">Need Advice?</h3>
                <p className="text-slate-300 text-xs font-light leading-relaxed">
                  Book a direct, personal consultation slot with Dr. Iqbal to address your chronic symptoms naturally.
                </p>
              </div>

              <Link
                href="/book"
                className="h-12 w-full flex items-center justify-center bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-brand-blue/10"
              >
                Book consultation
              </Link>
            </div>

            {/* Other Recent Reads */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-brand-navy mb-4">Recent Publications</h3>
              
              <ul className="space-y-4">
                {otherPosts.map((post) => (
                  <li key={post.slug} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                    <Link href={`/blog/${post.slug}`} className="group block space-y-1.5">
                      <span className="text-[10px] font-semibold text-brand-blue uppercase">{post.category}</span>
                      <h4 className="font-heading font-bold text-sm text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

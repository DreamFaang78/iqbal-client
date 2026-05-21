'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { DEFAULT_BLOGS, BlogData } from '@/lib/data';

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<BlogData[]>(DEFAULT_BLOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    // Attempt API fetch
    fetch('/api/blogs')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(() => {
        console.log('Using default blogs fallback');
      });
  }, []);

  // Compute unique categories
  useEffect(() => {
    const cats = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];
    setCategories(cats);
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-blue font-accent text-sm font-semibold uppercase tracking-wider">Hommed Medical Blog</span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Healthcare Insights & Natural Wellness
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-light">
            Stay informed with verified healthcare blogs written by Dr. Iqbal on classic homeopathy, healthy living, and symptom relief.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-brand-blue focus:outline-none"
            />
            <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.slug}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Category Tag */}
                  <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-brand-blue text-[10px] font-bold uppercase tracking-wider">
                    {blog.category}
                  </span>
                  
                  {/* Title */}
                  <h3 className="font-heading font-extrabold text-xl text-brand-navy leading-snug hover:text-brand-blue transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 text-sm leading-relaxed font-light">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{blog.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-brand-blue font-bold flex items-center space-x-0.5 hover:text-brand-navy transition-colors group"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto space-y-4">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-brand-navy">No Articles Found</h3>
            <p className="text-slate-500 text-sm font-light">Try checking your search filters or check back later.</p>
          </div>
        )}

      </div>
    </div>
  );
}

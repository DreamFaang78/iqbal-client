'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadStep, setLeadStep] = useState<'none' | 'name' | 'phone' | 'done'>('none');
  const [leadData, setLeadData] = useState({ name: '', phone: '', symptoms: '' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    setMessages([
      {
        id: 'greet',
        sender: 'ai',
        text: "Hello! I'm Dr. Iqbal's AI Healthcare Assistant. 🩺 How can I help you today? You can describe symptoms you're experiencing (e.g., hair fall, skin rashes, migraine) or ask about clinic timings.",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitQuery = async (userText: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // 2. Handle Lead Capture Flow
    if (leadStep === 'name') {
      setLeadData(prev => ({ ...prev, name: userText }));
      setLeadStep('phone');
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'ai',
        text: `Got it, ${userText}. Now, please enter your Phone Number so our clinic coordinator can call you to schedule the appointment.`,
        timestamp: new Date()
      }]);
      setLoading(false);
      return;
    }

    if (leadStep === 'phone') {
      const finalData = { ...leadData, phone: userText };
      setLeadData(finalData);
      setLeadStep('done');
      
      // Submit Lead to API
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: finalData.name,
            phone: userText,
            inquiry: `Captured via AI Assistant: ${finalData.symptoms}`
          })
        });
        
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'ai',
          text: `Thank you! I have registered your consultation request. Dr. Iqbal's clinic assistant will contact you at ${userText} shortly.`,
          timestamp: new Date()
        }]);
      } catch (err) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'ai',
          text: `I've noted down your contact. Please feel free to also reach us at +91 87561 24708 for quick support!`,
          timestamp: new Date()
        }]);
      }
      setLoading(false);
      return;
    }

    // 3. Normal Symptom / Query Processing
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText })
      });
      const data = await res.json();
      
      // If AI detects a symptom match and recommends a consultation
      if (data.recommendConsultation) {
        setLeadStep('name');
        setLeadData({ name: '', phone: '', symptoms: userText });
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'ai',
          text: `${data.reply}\n\nTo schedule a consultation for this, may I know your Full Name?`,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'ai',
          text: data.reply || "I am here to guide you. You can ask about our clinical specializations or appointment slot scheduling.",
          timestamp: new Date()
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting to the clinic server. You can directly connect with Dr. Iqbal on WhatsApp at +91 87561 24708.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    await submitQuery(userText);
  };

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      setIsOpen(true);
      if (customEvent.detail && customEvent.detail.query) {
        setLeadStep('none');
        submitQuery(customEvent.detail.query);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, [leadStep, leadData]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-all shadow-brand-blue/30"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-semibold text-sm whitespace-nowrap">
            Ask Dr. Iqbal's AI
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-[#0D1F3A] border border-white/12 rounded-[28px] shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-brand-navy p-4 text-white flex justify-between items-center border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm">HOMMED AI Assistant</h4>
                <p className="text-[10px] text-brand-green flex items-center font-semibold">
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full mr-1.5 animate-pulse"></span>
                  Active Wellness Guide
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0A1628]">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex items-start space-x-2.5 ${!isAi ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center ${isAi ? 'bg-blue-500/10 text-brand-cyan border border-brand-cyan/20' : 'bg-[#162847] text-white/70 border border-white/10'}`}>
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isAi ? 'bg-[#162847]/50 text-slate-200 border border-white/8' : 'bg-brand-blue text-white'
                  }`}>
                    {msg.text.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{para}</p>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-brand-cyan border border-[#00B4D8]/20 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-[#162847]/50 border border-white/8 p-3 rounded-2xl flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-brand-cyan/70 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-brand-cyan/70 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-brand-cyan/70 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-3.5 border-t border-white/10 bg-[#0D1F3A] flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={leadStep !== 'none' && leadStep !== 'done' ? 'Enter details here...' : 'Ask about hair fall, eczema, timings...'}
              className="flex-1 h-11 px-4 bg-[#162847]/50 border border-white/10 text-white placeholder:text-white/40 rounded-xl text-sm focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl shadow-md transition-all shadow-brand-blue/20 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'contactForms'), {
        ...formData,
        createdAt: Date.now(),
        read: false
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-crimson selection:text-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-24 lg:py-32 max-w-4xl">
        <h1 className="font-display text-5xl md:text-7xl mb-8">CONTACT</h1>
        <p className="font-body text-white/50 mb-16 max-w-xl">
          For any inquiries regarding your order, wholesale opportunities, or general questions, please reach out to us. We typically respond within 24 hours.
        </p>

        {status === 'success' ? (
          <div className="p-8 border border-white/20 bg-white/5 text-center">
            <h2 className="font-display text-2xl mb-2">Message Sent</h2>
            <p className="font-body text-white/50">Thank you for reaching out. Our team will get back to you shortly.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 font-accent tracking-widest text-xs uppercase hover:text-crimson transition-colors">
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-accent tracking-widest text-[10px] uppercase text-white/50 block">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-white/20 pb-4 focus:border-white focus:outline-none transition-colors font-body" />
              </div>
              <div className="space-y-2">
                <label className="font-accent tracking-widest text-[10px] uppercase text-white/50 block">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-white/20 pb-4 focus:border-white focus:outline-none transition-colors font-body" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-accent tracking-widest text-[10px] uppercase text-white/50 block">Subject</label>
              <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-transparent border-b border-white/20 pb-4 focus:border-white focus:outline-none transition-colors font-body" />
            </div>
            <div className="space-y-2">
              <label className="font-accent tracking-widest text-[10px] uppercase text-white/50 block">Message</label>
              <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-transparent border-b border-white/20 pb-4 focus:border-white focus:outline-none transition-colors font-body resize-none" />
            </div>
            
            {status === 'error' && <p className="text-crimson font-body text-sm">Failed to send message. Please try again.</p>}
            
            <button disabled={status === 'loading'} type="submit" className="bg-white text-black px-12 py-4 font-accent tracking-widest text-sm uppercase hover:bg-white/90 disabled:opacity-50 transition-colors">
              {status === 'loading' ? 'Sending...' : 'Transmit'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

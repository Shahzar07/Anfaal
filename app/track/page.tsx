'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TrackOrderPage() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeInput, setActiveInput] = useState(false);
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchValue.trim();
    if (!val) return;

    setLoading(true);
    setError('');

    try {
      const docRef = doc(db, 'orders', val);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         router.push(`/track/${val}`);
         return;
      }
      
      const qEmail = query(collection(db, 'orders'), where('customer.email', '==', val), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
         router.push(`/track/${snapEmail.docs[0].id}`);
         return;
      }
      
      const qFirst = query(collection(db, 'orders'), where('customer.firstName', '==', val), limit(1));
      const snapFirst = await getDocs(qFirst);
      if (!snapFirst.empty) {
         router.push(`/track/${snapFirst.docs[0].id}`);
         return;
      }

      setError('No matching order found. Please verify your details.');
    } catch (err) {
      console.error(err);
      setError('An error occurred during lookup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-crimson selection:text-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <span className="font-accent tracking-[0.2em] text-white/50 text-xs mb-8 block ml-1 uppercase">Order Status</span>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              TRACK<br/>
              YOUR<br/>
              <span className="text-white/40 italic">PARCEL</span>
            </h1>

            <div className="mt-16 sm:mt-24 max-w-xl">
              <form onSubmit={handleTrack} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-crimson to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-lg ${activeInput ? 'opacity-30' : ''}`} />
                <div className="relative flex flex-col sm:flex-row border-b border-white/20 hover:border-white/50 transition-colors duration-300 bg-black">
                  <input 
                    type="text" 
                    placeholder="ENTER ORDER ID OR EMAIL" 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setActiveInput(true)}
                    onBlur={() => setActiveInput(false)}
                    className="flex-1 bg-transparent py-6 px-2 text-white font-accent tracking-widest text-sm focus:outline-none placeholder:text-white/30"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="sm:w-24 flex items-center justify-center p-6 text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={24} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </button>
                </div>
              </form>
              
              <div className="h-6 mt-4">
                {error && (
                  <p className="text-crimson font-accent text-xs tracking-widest animate-in fade-in flex items-center">
                    <span className="w-1 h-1 bg-crimson rounded-full mr-2" />
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-white/40 font-body text-sm border-t border-white/10 pt-12">
              <div>
                <h4 className="text-white font-accent tracking-widest text-xs mb-3 uppercase">Delivery Times</h4>
                <p>Standard: 3-5 Business Days</p>
                <p>Express: 1-2 Business Days</p>
              </div>
              <div>
                <h4 className="text-white font-accent tracking-widest text-xs mb-3 uppercase">Need Assistance?</h4>
                <p>Contact our support team directly via email or our contact form for real-time updates.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

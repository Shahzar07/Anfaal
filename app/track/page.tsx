'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TrackOrderPage() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchValue.trim();
    if (!val) return;

    setLoading(true);
    setError('');

    try {
      // 1. Try treating it as an Order ID
      const docRef = doc(db, 'orders', val);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         router.push(`/track/${val}`);
         return;
      }
      
      // 2. Not found, try searching by email
      const qEmail = query(collection(db, 'orders'), where('customer.email', '==', val), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
         router.push(`/track/${snapEmail.docs[0].id}`);
         return;
      }
      
      // 3. Try searching by firstName (exact match, case sensitive)
      const qFirst = query(collection(db, 'orders'), where('customer.firstName', '==', val), limit(1));
      const snapFirst = await getDocs(qFirst);
      if (!snapFirst.empty) {
         router.push(`/track/${snapFirst.docs[0].id}`);
         return;
      }

      setError('No order found with that ID, Email, or First Name.');
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-xl w-full pt-20">
          <h1 className="font-display text-4xl mb-4 uppercase">Track Your Order</h1>
          <p className="font-body text-white-muted mb-8">Enter your order ID, email, or first name below to check the current status of your delivery.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <input 
              type="text" 
              placeholder="Order ID / Email / First Name" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-white/20 focus:border-white focus:outline-none text-white font-body w-full sm:w-80"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-white text-black px-8 py-3 font-accent tracking-widest text-sm hover:bg-gray-200 transition-colors uppercase flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={16} className="mr-2" />
                  Track
                </>
              )}
            </button>
          </form>
          {error && (
            <p className="mt-6 text-crimson font-body text-sm animate-in fade-in">
              {error}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

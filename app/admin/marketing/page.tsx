'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Settings2, Scissors, X, Copy, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function AdminMarketing() {
  const [activeTab, setActiveTab] = useState<'bundles' | 'coupons'>('bundles');
  
  const [coupons, setCoupons] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  
  const [couponForm, setCouponForm] = useState({ code: '', discount: '', type: 'percentage' });
  const [bundleForm, setBundleForm] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [couponsSnap, bundlesSnap] = await Promise.all([
        getDocs(collection(db, 'coupons')),
        getDocs(collection(db, 'bundles'))
      ]);
      setCoupons(couponsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setBundles(bundlesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount) return;
    try {
      await addDoc(collection(db, 'coupons'), {
        ...couponForm,
        code: couponForm.code.toUpperCase(),
        active: true,
        createdAt: Date.now()
      });
      setShowCouponModal(false);
      setCouponForm({ code: '', discount: '', type: 'percentage' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name || !bundleForm.price) return;
    try {
      await addDoc(collection(db, 'bundles'), {
        ...bundleForm,
        active: true,
        createdAt: Date.now()
      });
      setShowBundleModal(false);
      setBundleForm({ name: '', description: '', price: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const removeDoc = async (id: string, col: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-display text-3xl">Marketing & Promotions</h2>
          <p className="font-body text-gray-500 text-sm">Create bundles and discount codes to drive sales.</p>
        </div>
        <button 
          onClick={() => activeTab === 'bundles' ? setShowBundleModal(true) : setShowCouponModal(true)}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create {activeTab === 'bundles' ? 'Bundle' : 'Coupon'}
        </button>
      </div>

      <div className="bg-white border text-sm font-body border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${activeTab === 'bundles' ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            onClick={() => setActiveTab('bundles')}
          >
            Product Bundles
            {activeTab === 'bundles' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
            )}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${activeTab === 'coupons' ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            onClick={() => setActiveTab('coupons')}
          >
            Coupon Codes
            {activeTab === 'coupons' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-12 flex justify-center">
               <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
             </div>
          ) : activeTab === 'bundles' ? (
             bundles.length === 0 ? (
               <div className="p-12 text-center text-gray-500 max-w-md mx-auto py-20">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                   <Settings2 size={32} />
                 </div>
                 <h3 className="font-display text-xl text-black mb-2">No active bundles</h3>
                 <p className="mb-6">Offer customers a discount when they purchase combinations of products together. Great for clearing stock or increasing average order value.</p>
                 <button onClick={() => setShowBundleModal(true)} className="text-blue-600 font-medium hover:underline">Create your first bundle</button>
               </div>
             ) : (
               <div className="divide-y divide-gray-100">
                 {bundles.map(b => (
                   <div key={b.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                     <div>
                       <h4 className="font-bold text-lg text-black">{b.name}</h4>
                       <p className="text-gray-500">{b.description || 'No description'}</p>
                     </div>
                     <div className="flex items-center gap-6">
                       <span className="font-medium bg-gray-100 px-3 py-1 rounded-lg">PKR {Number(b.price).toLocaleString()}</span>
                       <button onClick={() => removeDoc(b.id, 'bundles')} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                     </div>
                   </div>
                 ))}
               </div>
             )
          ) : (
             coupons.length === 0 ? (
               <div className="p-12 text-center text-gray-500 max-w-md mx-auto py-20">
                 <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                   <Scissors size={32} />
                 </div>
                 <h3 className="font-display text-xl text-black mb-2">No active coupons</h3>
                 <p className="mb-6">Create percentage or flat-rate discount codes for special events, holidays, or specific customers to boost engagement.</p>
                 <button onClick={() => setShowCouponModal(true)} className="text-green-600 font-medium hover:underline">Create your first discount code</button>
               </div>
             ) : (
               <div className="divide-y divide-gray-100">
                 {coupons.map(c => (
                   <div key={c.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                     <div className="flex items-center gap-4">
                       <div className="bg-green-100 text-green-800 font-mono font-bold px-4 py-2 rounded border border-green-200 tracking-wider">
                         {c.code}
                       </div>
                       <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">{c.type === 'percentage' ? '%' : 'PKR'}</span>
                     </div>
                     <div className="flex items-center gap-6">
                       <span className="font-medium text-lg text-black">
                         {c.type === 'percentage' ? `${c.discount}% OFF` : `PKR ${c.discount} OFF`}
                       </span>
                       <button onClick={() => removeDoc(c.id, 'coupons')} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                     </div>
                   </div>
                 ))}
               </div>
             )
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden font-body animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-display text-lg text-black">Create Discount Code</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCoupon} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Coupon Code</label>
                <input required type="text" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none uppercase font-mono" placeholder="e.g. SUMMER24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Discount Type</label>
                  <select value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Value</label>
                  <input required type="number" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none" placeholder="e.g. 20" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowCouponModal(false)} className="px-4 py-2 text-gray-600 hover:text-black">Cancel</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bundle Modal */}
      {showBundleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden font-body animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-display text-lg text-black">Create Product Bundle</h3>
              <button onClick={() => setShowBundleModal(false)} className="text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddBundle} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Bundle Name</label>
                <input required type="text" value={bundleForm.name} onChange={e => setBundleForm({...bundleForm, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none" placeholder="e.g. The Essential Starter Kit" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Bundle Price (PKR)</label>
                <input required type="number" value={bundleForm.price} onChange={e => setBundleForm({...bundleForm, price: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none" placeholder="e.g. 15000" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Description</label>
                <textarea value={bundleForm.description} onChange={e => setBundleForm({...bundleForm, description: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none resize-none" rows={3} placeholder="Brief description of what's included..." />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowBundleModal(false)} className="px-4 py-2 text-gray-600 hover:text-black">Cancel</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Create Bundle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

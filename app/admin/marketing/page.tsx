'use client';

import { useState } from 'react';
import { Tag, Plus, Settings2, Scissors } from 'lucide-react';

export default function AdminMarketing() {
  const [activeTab, setActiveTab] = useState<'bundles' | 'coupons'>('bundles');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-display text-3xl">Marketing & Promotions</h2>
          <p className="font-body text-gray-500 text-sm">Create bundles and discount codes to drive sales.</p>
        </div>
        <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-colors flex items-center">
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
        <div className="p-12 text-center text-gray-500">
           {activeTab === 'bundles' ? (
             <div className="max-w-md mx-auto">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                 <Settings2 size={32} />
               </div>
               <h3 className="font-display text-xl text-black mb-2">No active bundles</h3>
               <p className="mb-6">Offer customers a discount when they purchase combinations of products together. Great for clearing stock or increasing average order value.</p>
               <button className="text-blue-600 font-medium hover:underline">Learn how bundling works</button>
             </div>
           ) : (
             <div className="max-w-md mx-auto">
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                 <Scissors size={32} />
               </div>
               <h3 className="font-display text-xl text-black mb-2">No active coupons</h3>
               <p className="mb-6">Create percentage or flat-rate discount codes for special events, holidays, or specific customers to boost engagement.</p>
               <button className="text-green-600 font-medium hover:underline">Get started with discounts</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

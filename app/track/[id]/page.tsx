'use client';
import { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function OrderTrackingDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        const docRef = doc(db, 'orders', resolvedParams.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [resolvedParams.id]);

  const getStatusStep = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-24 max-w-3xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl text-crimson mb-4">Error</h2>
            <p className="font-body text-white-muted">{error}</p>
          </div>
        ) : order ? (
          <div className="bg-[#111] p-8 md:p-12 border border-white/10 rounded-xl">
            <h1 className="font-display text-3xl mb-2">Order #{order.id}</h1>
            <p className="font-body text-sm text-white-muted mb-12">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* Tracking Timeline */}
            <div className="relative mb-16">
               {order.status === 'cancelled' ? (
                 <div className="text-center p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                   <h3 className="font-bold text-red-500">Order Cancelled</h3>
                   <p className="text-red-400/80 text-sm mt-1">This order has been cancelled and will not be delivered.</p>
                 </div>
               ) : (
                 <div className="flex justify-between items-center relative">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-0"></div>
                   <div 
                     className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white transition-all duration-500 ease-in-out -z-0"
                     style={{ width: `${((getStatusStep(order.status) - 1) / 2) * 100}%` }}
                   ></div>

                   <div className="relative z-10 flex flex-col items-center gap-3">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#111] transition-colors ${getStatusStep(order.status) >= 1 ? 'bg-white text-black' : 'bg-[#222] text-white-muted'}`}>
                       <Clock size={20} />
                     </div>
                     <span className="font-accent tracking-widest text-xs uppercase hidden md:block">Processing</span>
                   </div>

                   <div className="relative z-10 flex flex-col items-center gap-3">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#111] transition-colors ${getStatusStep(order.status) >= 2 ? 'bg-white text-black' : 'bg-[#222] text-white-muted'}`}>
                       <Truck size={20} />
                     </div>
                     <span className="font-accent tracking-widest text-xs uppercase hidden md:block">Shipped</span>
                   </div>

                   <div className="relative z-10 flex flex-col items-center gap-3">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#111] transition-colors ${getStatusStep(order.status) >= 3 ? 'bg-white text-black' : 'bg-[#222] text-white-muted'}`}>
                       <CheckCircle size={20} />
                     </div>
                     <span className="font-accent tracking-widest text-xs uppercase hidden md:block">Delivered</span>
                   </div>
                 </div>
               )}
            </div>

            {/* Order Details */}
            <div className="space-y-8 font-body">
              <div>
                <h3 className="font-accent tracking-widest text-xs text-white-muted uppercase mb-4 border-b border-white/10 pb-2">Shipping Information</h3>
                <div className="text-sm space-y-1">
                  <p className="font-bold">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <p>{order.customer?.address}</p>
                  {order.customer?.apartment && <p>{order.customer?.apartment}</p>}
                  <p>{order.customer?.city}, {order.customer?.postalCode}</p>
                  <p className="text-white-muted mt-2">{order.customer?.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-accent tracking-widest text-xs text-white-muted uppercase mb-4 border-b border-white/10 pb-2">Items</h3>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-[#222] rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><Package size={20} /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm md:text-base">{item.name}</p>
                        <p className="text-white-muted text-xs md:text-sm">Size: {item.size}</p>
                        <p className="text-white-muted text-xs md:text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-medium">
                        PKR {item.price?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex justify-between items-center mb-2 text-white-muted text-sm">
                  <span>Subtotal</span>
                  <span>PKR {order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-white-muted text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>PKR {order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

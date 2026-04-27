'use client';
import { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-crimson selection:text-white">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-40">
               <div className="w-12 h-12 border border-white/20 border-t-white rounded-full animate-spin"></div>
               <p className="mt-6 font-accent tracking-widest text-xs uppercase text-white/50">Locating Parcel...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-40">
              <h2 className="font-display text-4xl mb-4">NOT FOUND</h2>
              <p className="font-body text-white/50 mb-8">{error}</p>
              <Link href="/track" className="font-accent tracking-widest text-sm text-crimson hover:text-white transition-colors uppercase border-b border-crimson/30 hover:border-white pb-1">
                Try Another Search
              </Link>
            </div>
          ) : order ? (
            <div className="max-w-4xl mx-auto">
              <Link href="/track" className="inline-flex items-center text-white/40 hover:text-white transition-colors font-accent tracking-widest text-xs uppercase mb-12">
                ← Back to Search
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/10">
                <div>
                  <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-2">Order {order.id.slice(-8)}</h1>
                  <p className="font-accent tracking-widest text-xs text-white/40 uppercase">
                    Dated {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-accent tracking-widest text-xs text-white/40 uppercase mb-1">Status</p>
                  <p className={`font-display text-2xl ${order.status === 'cancelled' ? 'text-crimson' : 'text-white'}`}>
                    {order.status?.toUpperCase() || 'PROCESSING'}
                  </p>
                </div>
              </div>

              {/* Progress Bar UI */}
              <div className="mb-24 relative pt-8">
                {order.status === 'cancelled' ? (
                  <div className="p-6 border border-crimson/20 bg-crimson/5 text-center">
                    <p className="font-accent tracking-widest text-xs uppercase text-crimson">This order has been cancelled.</p>
                  </div>
                ) : (
                  <div>
                    <div className="absolute top-10 left-0 w-full h-[1px] bg-white/10 z-0" />
                    <div 
                      className="absolute top-10 left-0 h-[1px] bg-white transition-all duration-1000 ease-out z-0"
                      style={{ width: `${((getStatusStep(order.status) - 1) / 2) * 100}%` }}
                    />

                    <div className="relative z-10 flex justify-between">
                      {[
                        { label: 'Confirmed', icon: Clock, step: 1 },
                        { label: 'En Route', icon: Truck, step: 2 },
                        { label: 'Delivered', icon: CheckCircle, step: 3 }
                      ].map((s, idx) => {
                        const active = getStatusStep(order.status) >= s.step;
                        const current = getStatusStep(order.status) === s.step;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-6 h-6 flex items-center justify-center bg-black border ${active ? 'border-white text-white' : 'border-white/10 text-white/20'} mb-4 rounded-full transition-colors duration-500 delay-300`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-transparent'} ${current && 'animate-pulse'}`} />
                            </div>
                            <span className={`font-accent tracking-widest text-[10px] uppercase ${active ? 'text-white' : 'text-white/30'}`}>
                              {s.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                <div className="lg:col-span-7 space-y-12">
                  <div>
                    <h3 className="font-accent tracking-[0.2em] text-[10px] text-white/40 uppercase mb-6 flex items-center">
                      <Tag size={12} className="mr-2" /> Manifest
                    </h3>
                    <div className="divide-y divide-white/5 border-t border-white/5">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="py-6 flex gap-6 group">
                          <div className="w-20 h-24 bg-white/5 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale mix-blend-screen opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/10"><Package size={20} /></div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-body text-sm uppercase tracking-wide mb-1">{item.name}</p>
                            <p className="text-white/40 font-accent text-[10px] tracking-widest uppercase mb-auto">Size {item.size} • Qty {item.quantity}</p>
                            <p className="font-accent text-xs tracking-widest">PKR {item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-12">
                  <div>
                    <h3 className="font-accent tracking-[0.2em] text-[10px] text-white/40 uppercase mb-6 flex items-center">
                      <MapPin size={12} className="mr-2" /> Destination
                    </h3>
                    <div className="font-body text-sm leading-relaxed text-white/70 bg-white/[0.02] p-6 border border-white/5">
                      <p className="text-white uppercase tracking-wide mb-2">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p>{order.customer?.address}</p>
                      {order.customer?.apartment && <p>{order.customer?.apartment}</p>}
                      <p>{order.customer?.city}, {order.customer?.postalCode}</p>
                      <p className="mt-4">{order.customer?.phone}</p>
                      <p className="text-white/40">{order.customer?.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-accent tracking-[0.2em] text-[10px] text-white/40 uppercase mb-6">Summary</h3>
                    <div className="space-y-4 font-accent text-xs tracking-widest uppercase bg-white/[0.02] p-6 border border-white/5">
                      <div className="flex justify-between text-white/50">
                        <span>Subtotal</span>
                        <span>PKR {order.total?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Shipping</span>
                        <span>Complimentary</span>
                      </div>
                      <div className="flex justify-between text-white pt-4 border-t border-white/10 mt-4">
                        <span>Total</span>
                        <span>PKR {order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

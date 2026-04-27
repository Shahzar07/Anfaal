'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { addDays, format } from 'date-fns';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-display text-4xl mb-4">Order Not Found</h1>
          <p className="font-body text-white-muted mb-8">We couldn't find an order with that ID.</p>
          <Link href="/shop" className="bg-white text-black px-8 py-3 font-accent tracking-widest text-sm hover:bg-gray-200 transition-colors uppercase">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const estimatedDeliveryDate = addDays(orderDate, 7);

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter mb-4">Order Status</h1>
            <p className="font-body text-white-muted">Order ID: <span className="font-mono text-white text-sm">{order.id}</span></p>
          </div>

          <div className="bg-[#111] border border-white/10 p-8 md:p-12 mb-8">
            <div className="mb-12">
              <h2 className="font-display text-2xl mb-2">Estimated Delivery</h2>
              <p className="font-body text-4xl md:text-5xl text-crimson mb-2">{format(estimatedDeliveryDate, "EEEE, MMM do")}</p>
              <p className="font-body text-sm text-white-muted">Your order is being prepared. It typically takes up to 7 days for delivery.</p>
            </div>

            {/* Tracking Steps */}
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10 hidden md:block"></div>
              
              <div className="space-y-8 relative">
                {/* Step 1: Order Placed */}
                <div className={`flex items-start gap-4 ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-[#111] ${currentStep >= 1 ? 'bg-crimson text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <Package size={20} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-body font-medium text-lg">Order Placed</h3>
                    <p className="font-body text-sm text-white-muted">{format(orderDate, "MMM do, yyyy")}</p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className={`flex items-start gap-4 ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-[#111] ${currentStep >= 2 ? 'bg-crimson text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <Clock size={20} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-body font-medium text-lg">Processing</h3>
                    <p className="font-body text-sm text-white-muted">We are getting your items ready.</p>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div className={`flex items-start gap-4 ${currentStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-[#111] ${currentStep >= 3 ? 'bg-crimson text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <Truck size={20} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-body font-medium text-lg">Shipped</h3>
                    <p className="font-body text-sm text-white-muted">Your order is on the way.</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className={`flex items-start gap-4 ${currentStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-[#111] ${currentStep >= 4 ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-body font-medium text-lg">Delivered</h3>
                    {currentStep >= 4 && <p className="font-body text-sm text-white-muted">Package has arrived.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111] border border-white/10 p-6">
              <h3 className="font-accent tracking-widest text-xs uppercase text-white-muted mb-4">Shipping Address</h3>
              <p className="font-body text-sm leading-relaxed">
                {order.customer?.firstName} {order.customer?.lastName}<br />
                {order.customer?.address}<br />
                {order.customer?.apartment && <>{order.customer?.apartment}<br /></>}
                {order.customer?.city}, {order.customer?.postalCode}<br />
                {order.customer?.phone}
              </p>
            </div>
            
            <div className="bg-[#111] border border-white/10 p-6">
              <h3 className="font-accent tracking-widest text-xs uppercase text-white-muted mb-4">Order Summary</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.productId + item.size} className="flex justify-between font-body text-sm">
                    <span className="text-white-muted">{item.quantity}x {item.name} ({item.size})</span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10 flex justify-between font-body font-medium">
                  <span>Total</span>
                  <span className="text-crimson">Rs. {order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}

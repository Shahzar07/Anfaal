'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeft, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shipping;

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        customer: {
          email,
          firstName,
          lastName,
          address,
          apartment,
          city,
          postalCode,
          phone
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size
        })),
        subtotal,
        shipping,
        total,
        paymentMethod: 'COD',
        status: 'pending',
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Error creating order:', err);
      alert('There was an issue processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (success) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#000000', '#B22222', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#000000', '#B22222', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [success]);

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-4xl mb-4">Your cart is empty</h1>
        <Link href="/shop" className="bg-black text-white px-8 py-3 uppercase tracking-widest font-accent text-sm hover:bg-black/80 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-8 md:p-12 max-w-lg w-full border border-gray-200 shadow-sm"
        >
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="font-display text-3xl mb-2 text-black">Order Confirmed</h1>
          <p className="font-body text-gray-500 mb-8">Thank you for your purchase. We've received your order and will contact you shortly.</p>
          
          <div className="space-y-4">
            <Link href={`/track/${orderId}`} className="flex justify-center items-center w-full bg-crimson text-white py-4 font-accent tracking-widest text-sm hover:bg-red-700 transition-colors gap-2">
              TRACK MY ORDER <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="block w-full bg-black text-white py-4 font-accent tracking-widest text-sm hover:bg-black/90 transition-colors">
              CONTINUE SHOPPING
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col-reverse lg:flex-row">
      {/* Left side: Forms */}
      <div className="flex-1 lg:max-w-[55%] xl:max-w-[60%] lg:border-r border-gray-200">
        <div className="max-w-2xl mx-auto p-6 lg:p-12 lg:pr-24">
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="font-display text-3xl tracking-tight text-crimson mb-6 inline-block">
              ANFAAL
            </Link>
            <Link href="/cart" className="flex items-center text-sm font-body text-gray-500 hover:text-black transition-colors justify-center lg:justify-start">
              <ChevronLeft size={16} className="mr-1" />
              Return to cart
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-body mb-4">Contact</h2>
              <div className="space-y-4">
                <div>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email or mobile phone number" required className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="offers" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <label htmlFor="offers" className="ml-2 font-body text-sm text-gray-600">Email me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-xl font-body mb-4">Delivery</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name" required className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last name" required className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                <input type="text" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" required className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                <input type="text" value={apartment} onChange={e=>setApartment(e.target.value)} placeholder="Apartment, suite, etc. (optional)" className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="City" required className="md:col-span-1 w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                  <select value={city} onChange={e=>setCity(e.target.value)} className="md:col-span-1 w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm text-gray-600 focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white">
                    <option>Punjab</option>
                    <option>Sindh</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                    <option>Islamabad</option>
                  </select>
                  <input type="text" value={postalCode} onChange={e=>setPostalCode(e.target.value)} placeholder="Postal code" required className="md:col-span-1 w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" required className="w-full border border-gray-300 rounded p-3 font-body text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-xl font-body mb-2">Payment</h2>
              <p className="font-body text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-300 bg-gray-50/50">
                  <input type="radio" id="cod" name="paymentMethod" defaultChecked className="w-4 h-4 text-black focus:ring-black" />
                  <label htmlFor="cod" className="ml-3 font-body font-medium flex-1 cursor-pointer text-sm">Cash on Delivery (COD)</label>
                </div>
                <div className="flex items-center p-4">
                  <input type="radio" id="card" name="paymentMethod" className="w-4 h-4 text-black focus:ring-black" disabled />
                  <label htmlFor="card" className="ml-3 font-body flex-1 text-gray-400 cursor-not-allowed text-sm">Credit Card (Coming Soon)</label>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-[#111] hover:bg-black text-white py-5 px-6 font-accent tracking-widest text-sm uppercase transition-colors relative flex justify-center items-center rounded"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Complete order</span>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-6 border-t border-gray-200 text-xs font-body text-gray-500 text-center lg:text-left">
             All rights reserved Anfaal
          </div>
        </div>
      </div>

      {/* Right side: Summary */}
      <div className="flex-1 bg-[#fafafa] lg:max-w-[45%] xl:max-w-[40%] border-b lg:border-b-0 border-gray-200">
        <div className="max-w-md mx-auto p-6 lg:p-12 lg:pl-12 lg:pr-24 lg:sticky lg:top-0">
          <h2 className="lg:hidden text-lg font-body mb-6 font-medium">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10 font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-sm text-black truncate">{item.product.name}</h4>
                  <p className="font-body text-xs text-gray-500">{item.size}</p>
                </div>
                <div className="font-body text-sm font-medium">
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3 font-body text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-black">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="font-medium text-black">Free</span>
              ) : (
                <span className="font-medium text-black">Rs. {shipping.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center text-lg">
            <span className="font-body font-medium text-black">Total</span>
            <span className="font-body font-medium text-black">
              <span className="text-gray-500 text-xs mr-2 font-normal">PKR</span>
              Rs. {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

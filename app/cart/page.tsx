'use client';

import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartStore((state) => state.items.reduce((total, item) => total + item.product.price * item.quantity, 0));
  const shipping = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display text-5xl md:text-7xl mb-12 text-white uppercase text-center">SHOPPING BAG</h1>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-t border-black-border">
            <p className="font-accent tracking-widest text-xl text-white mb-8">YOUR CART IS EMPTY</p>
            <Link 
              href="/shop"
              className="px-8 py-4 bg-crimson text-white font-accent tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
            >
              RETURN TO SHOP
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left: Cart Items */}
            <div className="lg:w-[60%] lg:pr-8">
              <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] gap-4 mb-4 pb-4 border-b border-white-subtle font-accent tracking-widest text-xs text-white-muted uppercase">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              
              <ul className="divide-y divide-white-subtle">
                {items.map((item) => (
                  <li key={item.cartItemId} className="py-8 flex flex-col md:flex-row md:items-center gap-6 group relative">
                    <button 
                      onClick={() => removeItem(item.cartItemId)}
                      className="absolute top-8 right-0 md:hidden p-2 text-white-muted hover:text-crimson"
                    >
                       <X size={18} />
                    </button>

                    <div className="flex gap-6 items-center flex-1">
                      <Link href={`/shop/${item.product.slug}`} className="relative w-24 h-32 md:w-28 md:h-36 bg-black-card shrink-0 hover:opacity-80 transition-opacity">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </Link>
                      
                      <div className="flex flex-col justify-center">
                        <h3 className="font-display text-xl md:text-2xl mb-1 hover:text-crimson transition-colors">
                           <Link href={`/shop/${item.product.slug}`}>{item.product.name}</Link>
                        </h3>
                        <p className="font-body text-white-muted text-sm mb-3">
                           Size: {item.size} <span className="mx-2">|</span> Price: PKR {item.product.price.toLocaleString()}
                        </p>
                        
                        {/* Mobile Quantity Control (hidden on md) */}
                        <div className="md:hidden flex items-center border border-white-subtle w-fit">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 text-white-muted hover:text-white">
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-10 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 text-white-muted hover:text-white">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex justify-center shrink-0 w-32">
                        <div className="flex items-center border border-white-subtle w-fit transition-colors hover:border-white">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 px-3 text-white-muted hover:text-white">
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 px-3 text-white-muted hover:text-white">
                            <Plus size={14} />
                          </button>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-end items-center shrink-0 w-24 gap-4">
                       <span className="font-body text-lg">PKR {(item.product.price * item.quantity).toLocaleString()}</span>
                       <button 
                         onClick={() => removeItem(item.cartItemId)}
                         className="text-white-muted hover:text-crimson p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X size={18} />
                       </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-[40%]">
              <div className="bg-black-card border border-white-subtle p-6 md:p-8 sticky top-32">
                <h2 className="font-accent tracking-widest text-2xl text-white mb-8 uppercase">Order Summary</h2>
                
                <div className="flex flex-col gap-4 font-body text-sm mb-8 border-b border-white-subtle pb-6">
                  <div className="flex justify-between text-white-muted">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-white">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white-muted">
                    <span>Estimated Shipping</span>
                    {shipping === 0 ? (
                       <span className="text-crimson font-light tracking-wide uppercase font-accent">Free</span>
                    ) : (
                       <span className="text-white">PKR {shipping.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 font-body text-2xl">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>

                <button className="w-full bg-white text-black font-accent tracking-widest py-4 text-xl hover:bg-crimson hover:text-white flex items-center justify-between px-6 transition-all duration-300 group">
                   PROCEED TO CHECKOUT
                   <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="mt-8 space-y-4">
                   <div className="flex items-center gap-4 text-white-muted">
                     <ShieldCheck size={20} className="stroke-[1.5]" />
                     <p className="font-body text-xs">100% Secure SSL Checkout</p>
                   </div>
                   <div className="flex items-center gap-4 text-white-muted">
                     <Truck size={20} className="stroke-[1.5]" />
                     <p className="font-body text-xs">Free shipping unlocked over PKR 3,000</p>
                   </div>
                   <div className="flex items-center gap-4 text-white-muted">
                     <Clock size={20} className="stroke-[1.5]" />
                     <p className="font-body text-xs">Customer support available 24/7</p>
                   </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

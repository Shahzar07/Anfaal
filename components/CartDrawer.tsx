'use client';

import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { isOpen, items, toggleCart, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartStore((state) => state.items.reduce((total, item) => total + item.product.price * item.quantity, 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-black-card border-l border-black-border shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-white-subtle flex justify-between items-center">
              <h2 className="font-accent tracking-widest text-xl flex items-center gap-2">
                <ShoppingBag size={20} />
                YOUR CART
              </h2>
              <button 
                onClick={toggleCart}
                className="text-white-muted hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white-muted">
                  <ShoppingBag size={48} className="mb-4 opacity-50 stroke-[1]" />
                  <p className="font-body text-center mb-6">Your cart is empty.</p>
                  <button 
                    onClick={toggleCart}
                    className="font-accent tracking-wider bg-white text-black px-8 py-3 hover:bg-crimson hover:text-white transition-colors duration-300"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="flex gap-4">
                      <div className="relative w-24 h-32 bg-black flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-display text-lg leading-tight line-clamp-2 pr-6">
                              <Link href={`/shop/${item.product.slug}`} onClick={toggleCart} className="hover:text-crimson transition-colors">
                                {item.product.name}
                              </Link>
                            </h3>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-white-muted hover:text-crimson transition-colors shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="font-body text-xs text-white-muted mb-2">
                            Size: {item.size} | {item.product.category.toUpperCase()}
                          </p>
                          <p className="font-body font-bold text-sm">
                            PKR {item.product.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center border border-white-subtle w-fit rounded-sm overflow-hidden mt-3">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-white-subtle transition-colors text-white-muted"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-white-subtle transition-colors text-white-muted"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white-subtle bg-black">
                <div className="flex justify-between items-center mb-4 font-body">
                  <span className="text-white-muted">Subtotal</span>
                  <span className="font-bold text-lg">PKR {subtotal.toLocaleString()}</span>
                </div>
                <p className="font-body text-xs text-white-muted mb-6">
                  Shipping and taxes calculated at checkout. Free shipping on orders over PKR 3,000.
                </p>
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full text-center py-4 bg-crimson text-white font-accent tracking-widest text-lg hover:bg-crimson-glow transition-all duration-300"
                >
                  CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

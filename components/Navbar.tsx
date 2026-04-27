'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setTimeout(() => setMobileMenuOpen(false), 0);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navClasses = `fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    scrolled || !isHome || mobileMenuOpen
      ? 'bg-black/90 backdrop-blur-md border-b border-black-border py-4 top-[30px] md:top-[40px]' // Accounting for announcement bar height
      : 'bg-transparent py-6 border-b border-transparent top-[30px] md:top-[40px]'
  }`;

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-crimson transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button className="text-white hover:text-crimson transition-colors">
              <Search size={22} className="stroke-[1.5]" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <Search className="text-white hover:text-crimson cursor-pointer transition-colors stroke-[1.5]" size={20} />
            <div className="flex items-center gap-8 font-accent tracking-[0.15em] text-sm text-white">
              <Link href="/shop" className="hover:text-crimson transition-colors">SHOP ALL</Link>
              <Link href="/shop?category=t-shirts" className="hover:text-crimson transition-colors">T-SHIRTS</Link>
              <Link href="/shop?category=hoodies" className="hover:text-crimson transition-colors">HOODIES</Link>
            </div>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-display text-3xl tracking-tight text-crimson">
              ANFAAL
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-accent tracking-[0.15em] text-sm text-white">
            <Link href="/shop?category=tracksuits" className="hover:text-crimson transition-colors">TRACKSUITS</Link>
            <Link href="/about" className="hover:text-crimson transition-colors">ABOUT</Link>
            <Link href="/track" className="hover:text-crimson transition-colors">TRACK ORDER</Link>
            <div className="flex items-center gap-6 ml-4">
              <Link href="/wishlist">
                <Heart className="hover:text-crimson cursor-pointer transition-colors stroke-[1.5]" size={20} />
              </Link>
              <button onClick={toggleCart} className="relative group">
                <ShoppingBag className="group-hover:text-crimson transition-colors stroke-[1.5]" size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-crimson text-white text-[10px] font-body font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/wishlist" className="text-white hover:text-crimson transition-colors">
              <Heart size={22} className="stroke-[1.5]" />
            </Link>
            <button onClick={toggleCart} className="relative text-white hover:text-crimson transition-colors">
              <ShoppingBag size={22} className="stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-crimson text-white text-[10px] font-body font-bold w-4 h-4 rounded-full flex items-center justify-center">
                   {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black pt-32 px-6 pb-8 flex flex-col"
          >
            <ul className="flex flex-col gap-6 font-display text-4xl mt-8">
              <li><Link href="/shop" className="hover:text-crimson text-white block">Shop All</Link></li>
              <li><Link href="/shop?category=t-shirts" className="hover:text-crimson text-white block">T-Shirts</Link></li>
              <li><Link href="/shop?category=hoodies" className="hover:text-crimson text-white block">Hoodies</Link></li>
              <li><Link href="/shop?category=tracksuits" className="hover:text-crimson text-white block">Tracksuits</Link></li>
              <li><Link href="/about" className="hover:text-crimson text-white block mt-6">About Brand</Link></li>
              <li><Link href="/track" className="hover:text-crimson text-white block">Track Order</Link></li>
            </ul>
            <div className="mt-auto pb-8">
              <p className="font-accent tracking-widest text-xs text-white-muted mb-4">JOIN THE CIRCLE</p>
              <div className="flex gap-4">
                 <Link href="#" className="font-body text-sm underline hover:text-crimson decoration-white/30">Instagram</Link>
                 <Link href="#" className="font-body text-sm underline hover:text-crimson decoration-white/30">TikTok</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

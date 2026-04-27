'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-black flex flex-col pt-16 pb-8 border-t border-black-border overflow-hidden">
      {/* Background large text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-display text-[15vw] leading-none text-white opacity-[0.03] whitespace-nowrap tracking-tighter">
          ANFAAL
        </span>
      </div>

      <div className="container mx-auto px-6 lg:px-12 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-3xl mb-4 text-white">ANFAAL</h3>
            <p className="font-body text-white-muted text-sm max-w-sm leading-relaxed mb-6">
              Redefining streetwear with premium materials and dark aesthetics. Crafted for the bold.
            </p>
            <p className="font-accent tracking-widest text-xs text-white opacity-80">
              CRAFTED IN PAKISTAN
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-accent tracking-widest text-sm text-white-muted mb-6">SHOP</h4>
            <ul className="space-y-4 font-body text-sm text-white">
              <li><Link href="/shop" className="hover:text-crimson transition-colors duration-200">All Products</Link></li>
              <li><Link href="/shop?category=t-shirts" className="hover:text-crimson transition-colors duration-200">T-Shirts</Link></li>
              <li><Link href="/shop?category=hoodies" className="hover:text-crimson transition-colors duration-200">Hoodies</Link></li>
              <li><Link href="/shop?category=tracksuits" className="hover:text-crimson transition-colors duration-200">Tracksuits</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-accent tracking-widest text-sm text-white-muted mb-6">SUPPORT</h4>
            <ul className="space-y-4 font-body text-sm text-white">
              <li><Link href="/track" className="hover:text-crimson transition-colors duration-200">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-crimson transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-accent tracking-widest text-sm text-white-muted mb-6">SOCIALS</h4>
            <ul className="space-y-4 font-body text-sm text-white">
              <li><a href="#" className="hover:text-crimson transition-colors duration-200">Instagram</a></li>
              <li><a href="#" className="hover:text-crimson transition-colors duration-200">TikTok</a></li>
              <li><a href="#" className="hover:text-crimson transition-colors duration-200">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white-subtle">
          <p className="font-body text-xs text-white-muted mb-4 md:mb-0">
            &copy; 2025 ANFAAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 font-body text-xs text-white-muted">
            <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Shipping Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

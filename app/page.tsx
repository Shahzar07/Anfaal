'use client';
import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { CategoryStrip } from '@/components/CategoryStrip';
import { ProductGrid } from '@/components/ProductGrid';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { products as hardcodedProducts } from '@/lib/products';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        let firestoreProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Quick migration fixing broken Unsplash URLs from early seed data
        const brokenImageMap: Record<string, string> = {
          '1526414963567-0c7ed0e6871a': 'https://picsum.photos/seed/p8/800/1000',
          '1556821840-0a25f18c2fc9': 'https://picsum.photos/seed/p10/800/1000',
          '1563280145-d85626c9f2b8': 'https://picsum.photos/seed/p11_2/800/1000',
          '1563280145-2bc5d3c8d17d': 'https://picsum.photos/seed/p11/800/1000',
          '1620799139834-6b8f844fb2b5': 'https://picsum.photos/seed/p3_2/800/1000',
          '1556821840-b63f27f6b216': 'https://picsum.photos/seed/p7/800/1000',
          '1556821840-02ba4bb0c4a4': 'https://picsum.photos/seed/p7_2/800/1000',
        };

        firestoreProducts = firestoreProducts.map(p => {
          if (!p.images) return p;
          let changed = false;
          let newImages = p.images.map((img: string) => {
            let replaced = img;
            Object.keys(brokenImageMap).forEach(key => {
              if (replaced.includes(key)) replaced = brokenImageMap[key];
            });
            if (replaced !== img) changed = true;
            return replaced;
          });
          
          if (changed) {
            setDoc(doc(db, 'products', p.id), { images: newImages }, { merge: true }).catch(console.error);
          }

          return { ...p, images: newImages };
        });
        
        // Seed database if empty
        if (firestoreProducts.length === 0) {
          console.log('Seeding products...');
          for (const p of hardcodedProducts) {
            await setDoc(doc(db, 'products', p.id), {
              name: p.name,
              price: p.price,
              category: p.category,
              description: p.description,
              images: p.images,
              sizes: p.sizes,
              stock: 10,
              badge: p.badge || null,
              originalPrice: p.originalPrice || null,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
          }
          const newSnap = await getDocs(collection(db, 'products'));
          firestoreProducts = newSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }

        setProducts(firestoreProducts);
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  }, []);

  const featuredDrops = products.slice(0, 4);
  const bestSellers = products.slice(-4).reverse();

  return (
    <>
      <HeroSection />
      
      <MarqueeStrip />
      
      <CategoryStrip />

      {/* FEATURED DROPS */}
      <section className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-white">Featured Drops</h2>
            <Link href="/shop" className="hidden md:inline-block font-accent tracking-widest text-sm hover:text-crimson transition-colors border-b border-transparent hover:border-crimson pb-1">
              VIEW ALL
            </Link>
          </div>
          <ProductGrid products={featuredDrops} columns={4} />
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-block px-8 py-4 border border-white-subtle hover:border-white font-accent tracking-widest text-sm transition-colors">
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* CRAFTED FOR THE BOLD BANNER */}
      <section className="relative py-32 md:py-48 bg-black-card border-y border-white-subtle overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black-card via-black-card/50 to-black-card z-10" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8">
            CRAFTED FOR THE <span className="text-crimson italic">BOLD</span>
          </h2>
          <div className="w-24 h-[2px] bg-crimson mx-auto mb-8" />
          <p className="font-body text-white-muted max-w-2xl mx-auto text-lg md:text-xl">
            We don&apos;t follow trends. We set them. Premium materials met with uncompromising dark aesthetics. This is Anfaal.
          </p>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-white">Bestsellers</h2>
          </div>
          <ProductGrid products={bestSellers} columns={4} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 md:py-32 bg-crimson relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle noise/texture pattern could go here */}
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="font-accent tracking-[0.2em] text-white/80 text-sm mb-4 block">EXCLUSIVES & EARLY ACCESS</span>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-8">JOIN THE ANFAAL CIRCLE</h2>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-1 bg-transparent border-b-2 border-white/30 text-white placeholder:text-white/50 py-4 px-2 font-accent text-lg tracking-widest focus:outline-none focus:border-white transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-white text-crimson font-accent tracking-widest text-lg px-8 py-4 hover:bg-black hover:text-white transition-colors duration-300"
            >
              SUBSCRIBE
            </button>
          </form>
          <p className="font-body text-xs text-white/70 mt-6">
            By subscribing you agree to our Terms of Service. Minimal emails. Only the essentials.
          </p>
        </div>
      </section>
    </>
  );
}

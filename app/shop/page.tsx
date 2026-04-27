'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, Size } from '@/lib/types';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Size filter (checks if product has at least one of the selected sizes)
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some((size: string) => selectedSizes.includes(size as any)));
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange[1]);

    // Sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => (a.badge === 'NEW' ? -1 : 1));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      // 'featured' keeps original order
    }

    return result;
  }, [selectedCategories, selectedSizes, priceRange, sortOption]);

  const removeCategory = (cat: Category) => {
    setSelectedCategories(prev => prev.filter(c => c !== cat));
  };
  
  const removeSize = (size: Size) => {
    setSelectedSizes(prev => prev.filter(s => s !== size));
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center mb-16">
        <h1 className="font-display text-5xl md:text-7xl mb-4 text-white uppercase text-center">THE COLLECTION</h1>
        <div className="flex gap-2 text-sm font-accent tracking-widest text-white-muted uppercase">
          <Link href="/" className="hover:text-crimson transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Shop All</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="container mx-auto px-4 lg:px-8 mb-8">
        <div className="flex justify-between items-center pb-4 border-b border-black-border">
          <button 
            className="lg:hidden flex items-center gap-2 font-accent tracking-widest text-sm text-white hover:text-crimson transition-colors"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
            FILTERS
          </button>
          
          <div className="hidden lg:flex gap-2">
            <span className="font-accent tracking-widest text-sm text-white-muted uppercase flex items-center">
               <SlidersHorizontal size={18} className="mr-2"/> FILTERS
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline font-body text-sm text-white-muted">
              {filteredProducts.length} Results
            </span>
            
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 font-accent tracking-widest text-sm text-white hover:text-crimson transition-colors uppercase"
              >
                Sort: {sortOption.replace('-', ' ')}
                <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black-card border border-white-subtle z-30 shadow-xl font-accent tracking-widest text-sm">
                  {(['featured', 'newest', 'price-low', 'price-high'] as const).map(option => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-3 hover:bg-white-subtle transition-colors uppercase ${sortOption === option ? 'text-crimson' : 'text-white'}`}
                      onClick={() => {
                        setSortOption(option);
                        setIsSortOpen(false);
                      }}
                    >
                      {option.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        {(selectedCategories.length > 0 || selectedSizes.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-6">
            {selectedCategories.map(cat => (
              <span key={cat} className="flex items-center gap-2 px-3 py-1 bg-white-subtle text-white font-body text-xs rounded-full">
                {cat.toUpperCase()}
                <button onClick={() => removeCategory(cat)} className="hover:text-crimson"><X size={12} /></button>
              </span>
            ))}
            {selectedSizes.map(size => (
              <span key={size} className="flex items-center gap-2 px-3 py-1 bg-white-subtle text-white font-body text-xs rounded-full">
                Size {size}
                <button onClick={() => removeSize(size)} className="hover:text-crimson"><X size={12} /></button>
              </span>
            ))}
            <button 
              onClick={() => { setSelectedCategories([]); setSelectedSizes([]); setPriceRange([0, 20000]); }}
              className="text-xs font-body text-crimson hover:underline"
            >
               Clear all
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 lg:px-8 flex items-start gap-12">
        <FilterSidebar 
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
        />
        
        <div className="flex-1 w-full relative min-h-[500px]">
          {filteredProducts.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center py-20">
                <p className="font-display text-2xl text-white mb-4">No products found</p>
                <p className="font-body text-white-muted mb-8">Try adjusting your filters to find what you&apos;re looking for.</p>
                <button 
                  onClick={() => { setSelectedCategories([]); setSelectedSizes([]); setPriceRange([0, 20000]); }}
                  className="px-8 py-3 bg-white text-black font-accent tracking-widest hover:bg-crimson hover:text-white transition-colors"
                >
                   CLEAR FILTERS
                </button>
             </div>
          ) : (
            <ProductGrid products={filteredProducts} columns={3} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center font-accent tracking-widest text-crimson">LOADING...</div>}>
      <ShopContent />
    </Suspense>
  );
}

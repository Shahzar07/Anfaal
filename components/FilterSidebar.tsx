'use client';
import { Category, Size } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: Category[];
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>;
  selectedSizes: Size[];
  setSelectedSizes: Dispatch<SetStateAction<Size[]>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'T-Shirts', value: 't-shirts' },
  { label: 'Hoodies', value: 'hoodies' },
  { label: 'Sweatshirts', value: 'sweatshirts' },
  { label: 'Tracksuits', value: 'tracksuits' },
];

const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedSizes,
  setSelectedSizes,
  priceRange,
  setPriceRange,
  isOpen,
  setIsOpen
}: FilterSidebarProps) {
  
  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size: Size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([0, 20000]);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full font-body">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl tracking-wide">Filters</h2>
        {(selectedCategories.length > 0 || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 20000) && (
          <button onClick={clearFilters} className="text-sm font-accent tracking-widest text-white-muted hover:text-white uppercase transition-colors">
            Clear All
          </button>
        )}
        <button onClick={() => setIsOpen(false)} className="lg:hidden ml-4">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-10 flex-1 overflow-y-auto hide-scrollbar pr-2">
        
        {/* Categories */}
        <div>
          <h3 className="font-accent tracking-widest text-lg mb-4 uppercase">Category</h3>
          <div className="space-y-3">
            {CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.value) ? 'bg-crimson border-crimson' : 'border-white-subtle group-hover:border-white'}`}>
                  {selectedCategories.includes(cat.value) && <div className="w-2.5 h-2.5 bg-white" />}
                </div>
                <span className={`text-sm transition-colors ${selectedCategories.includes(cat.value) ? 'text-white' : 'text-white-muted group-hover:text-white'}`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="font-accent tracking-widest text-lg mb-4 uppercase">Size</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`w-12 h-12 flex items-center justify-center font-accent transition-colors ${
                  selectedSizes.includes(size) 
                    ? 'bg-crimson text-white border-crimson' 
                    : 'border border-white-subtle text-white-muted hover:border-white hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-accent tracking-widest text-lg mb-4 uppercase flex justify-between">
            <span>Price Range</span>
          </h3>
          <div className="px-2">
            <input 
              type="range" 
              min="0" 
              max="20000" 
              step="500"
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full appearance-none bg-white-subtle h-1 rounded outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-crimson cursor-pointer"
            />
            <div className="flex justify-between items-center mt-4 text-sm text-white-muted">
              <span>PKR 0</span>
              <span>PKR {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 lg:hidden">
        <button 
          onClick={() => setIsOpen(false)}
          className="w-full bg-crimson text-white py-4 font-accent tracking-widest uppercase hover:bg-crimson-bright transition-colors"
        >
          View Results
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 sticky top-[120px] h-[calc(100vh-140px)]">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 w-[85vw] sm:w-[350px] bg-black-card border-r border-black-border p-6 z-50 lg:hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

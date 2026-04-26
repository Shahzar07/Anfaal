'use client';
import { Product, Size } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface QuickAddButtonProps {
  product: Product;
  isHovered: boolean;
}

export function QuickAddButton({ product, isHovered }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleSizeSelect = (size: Size) => {
    addItem(product, size, 1);
    setIsOpen(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="p-4"
          >
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
              className="w-full bg-white text-black font-accent text-lg tracking-widest py-3 uppercase hover:bg-crimson hover:text-white transition-colors"
            >
              Quick Add
            </button>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-black-card border-t border-black-border p-4 shadow-2xl flex flex-col gap-3"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-white-muted text-xs tracking-widest uppercase font-accent">Select Size</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                className="text-white-muted hover:text-white pb-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSizeSelect(size); }}
                  className="py-2 border border-white-subtle hover:border-white hover:bg-white hover:text-black transition-colors font-accent text-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

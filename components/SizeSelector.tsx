'use client';
import { Size } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: Size | null;
  onSelect: Dispatch<SetStateAction<Size | null>>;
  error?: boolean;
}

export function SizeSelector({ sizes, selectedSize, onSelect, error }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className={`font-accent tracking-widest uppercase text-sm ${error ? 'text-crimson' : 'text-white-muted'}`}>
          Size {error && '* Required'}
        </span>
        <button className="text-white-muted hover:text-white underline text-xs tracking-wider transition-colors">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`w-14 h-14 flex items-center justify-center font-accent transition-all duration-200
              ${selectedSize === size 
                ? 'bg-crimson text-white border-crimson shadow-[0_0_15px_rgba(139,0,0,0.3)]' 
                : 'border border-white-subtle text-white-muted hover:border-white hover:text-white'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

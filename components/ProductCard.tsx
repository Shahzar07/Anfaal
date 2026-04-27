'use client';
import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { QuickAddButton } from './QuickAddButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div 
      className="group relative flex flex-col font-body w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black-card border border-transparent group-hover:border-crimson/50 transition-colors duration-500">
        <Link href={`/shop/${product.slug || product.id}`} className="absolute inset-0 z-10 w-full h-full block">
          
          {/* Main Image */}
          <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            {product.images[0] && (
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          
          {/* Hover Image */}
          <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0'} transform`}>
            {product.images[1] && (
              <Image 
                src={product.images[1]} 
                alt={`${product.name} alternate view`}
                fill
                className="object-cover object-center transition-transform duration-[10s] ease-linear"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>

        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="bg-white text-black font-accent px-3 py-1 text-sm tracking-widest uppercase">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Toggle */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors"
        >
          <Heart size={18} className={isWishlisted ? "fill-crimson text-crimson" : ""} />
        </button>

        {/* Quick Add overlay */}
        <QuickAddButton product={product} isHovered={isHovered} />
      </div>

      {/* Info Container */}
      <div className="pt-4 flex flex-col items-start">
        <Link href={`/shop/${product.slug || product.id}`} className="w-full">
          <h3 className="font-display text-xl sm:text-2xl text-white group-hover:text-crimson-bright transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="w-full flex items-center gap-3 mt-1">
          <span className="text-white-muted font-light tracking-wide">
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-white-subtle line-through text-sm">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

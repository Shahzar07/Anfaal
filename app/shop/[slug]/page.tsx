'use client';

import { useMemo } from 'react';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Minus, Plus, Heart, ShoppingBag, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState, use } from 'react';

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping'>('description');
  
  const addItem = useCartStore(state => state.addItem);

  const product = useMemo(() => {
    return products.find(p => p.slug === resolvedParams.slug);
  }, [resolvedParams.slug]);

  if (!product) {
    notFound();
  }

  const relatedProducts = useMemo(() => {
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    // Size type is inferred from types.ts where Size doesn't expect arbitrary string. 
    // Types.ts size is 'S'|'M'|'L'|'XL'|'XXL'. Fast cast.
    addItem(product, selectedSize as any, quantity);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 font-body">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 mb-8 text-xs font-accent tracking-widest uppercase">
        <Link href="/" className="text-white-muted hover:text-crimson transition-colors">Home</Link>
        <span className="mx-2 text-white-subtle">/</span>
        <Link href="/shop" className="text-white-muted hover:text-crimson transition-colors">Shop</Link>
        <span className="mx-2 text-white-subtle">/</span>
        <Link href={`/shop?category=${product.category}`} className="text-white-muted hover:text-crimson transition-colors">{product.category}</Link>
        <span className="mx-2 text-white-subtle">/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Gallery */}
          <div className="lg:w-[60%] flex gap-4 lg:gap-6 flex-col-reverse md:flex-row">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 hide-scrollbar pb-2 md:pb-0">
               {product.images.map((img, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveImageIndex(i)}
                   className={`relative w-20 h-24 md:w-full md:aspect-[3/4] shrink-0 bg-black-card ${activeImageIndex === i ? 'ring-1 ring-crimson' : 'opacity-60 hover:opacity-100'} transition-all duration-300`}
                 >
                   <Image src={img} alt={`${product.name} - view ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                 </button>
               ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full bg-black-card overflow-hidden group">
               {product.badge && (
                  <div className="absolute top-4 left-4 z-20 bg-white text-black font-accent tracking-widest text-sm px-4 py-1 uppercase">
                    {product.badge}
                  </div>
               )}
               <Image 
                 src={product.images[activeImageIndex]} 
                 alt={product.name}
                 fill
                 className="object-cover w-full h-full"
                 priority
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-[40%] flex flex-col">
            <h1 className="font-display text-4xl lg:text-5xl text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
               {product.originalPrice ? (
                 <>
                   <span className="text-white-muted line-through text-lg">PKR {product.originalPrice.toLocaleString()}</span>
                   <span className="text-crimson text-2xl font-bold tracking-wide">PKR {product.price.toLocaleString()}</span>
                 </>
               ) : (
                 <span className="text-white text-2xl font-bold tracking-wide">PKR {product.price.toLocaleString()}</span>
               )}
            </div>

            <p className="text-white-muted text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="w-full h-px bg-white-subtle mb-8" />

            {/* Size Selector */}
            <div className="mb-8">
               <div className="flex justify-between items-end mb-4">
                 <span className="font-accent tracking-widest text-sm uppercase text-white">Select Size</span>
                 <button className="text-white-muted text-xs underline hover:text-crimson transition-colors">Size Guide</button>
               </div>
               
               <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                 {product.sizes.map(size => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`py-3 font-accent tracking-widest transition-all duration-300 border ${
                       selectedSize === size 
                       ? 'bg-crimson border-crimson text-white scale-[1.02]' 
                       : 'border-white-subtle text-white hover:border-white'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
               {!selectedSize && (
                 <p className="text-crimson text-xs mt-3 hidden" id="size-error">Please select a size.</p>
               )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
               <div className="flex gap-4 h-14">
                 {/* Quantity */}
                 <div className="flex items-center justify-between border border-white-subtle w-32 px-4 shrink-0 transition-colors hover:border-white">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white-muted hover:text-white p-2">
                     <Minus size={16} />
                   </button>
                   <span className="text-white font-accent text-lg">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="text-white-muted hover:text-white p-2">
                     <Plus size={16} />
                   </button>
                 </div>
                 
                 {/* Add to Cart */}
                 <button 
                   onClick={handleAddToCart}
                   disabled={!product.inStock}
                   className={`flex-1 flex items-center justify-center gap-3 font-accent tracking-widest text-lg transition-all duration-300 relative overflow-hidden group ${
                     product.inStock 
                     ? 'bg-white text-black hover:bg-crimson hover:text-white border border-transparent' 
                     : 'bg-white-subtle text-white-muted cursor-not-allowed'
                   }`}
                 >
                   <ShoppingBag size={20} className={product.inStock ? "group-hover:stroke-white transition-colors" : ""} />
                   <span className="relative z-10">{product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                 </button>
               </div>

               {/* Add to wishlist */}
               <button 
                 onClick={() => setIsWishlisted(!isWishlisted)}
                 className="w-full h-14 border border-white-subtle flex items-center justify-center gap-3 font-accent tracking-widest text-white hover:border-white hover:bg-white-subtle/10 transition-colors mt-2"
               >
                 <Heart size={20} className={isWishlisted ? "fill-crimson text-crimson" : ""} />
                 {isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
               </button>
            </div>

            {/* Info accordions/tabs */}
            <div className="border border-white-subtle border-b-0 divide-y divide-white-subtle font-accent tracking-widest text-sm uppercase mb-12">
               <button 
                 onClick={() => setActiveTab('description')}
                 className={`w-full py-5 px-6 text-left hover:bg-white-subtle/30 transition-colors flex justify-between items-center ${activeTab === 'description' ? 'text-white bg-white-subtle/10' : 'text-white-muted'}`}
               >
                 Detailed Information
                 <Plus size={16} className={`transition-transform duration-300 ${activeTab === 'description' ? 'rotate-45' : ''}`} />
               </button>
               {activeTab === 'description' && (
                 <div className="p-6 font-body text-white-muted text-sm normal-case tracking-normal border-b border-white-subtle bg-black-card leading-relaxed">
                    Designed for precision. Crafted with heavyweight ring-spun cotton for unmatched durability and a structured drape. Each piece is garment-dyed and heavily washed for a vintage feel that ages gracefully.
                    <br/><br/>
                    Machine wash cold with like colors. Do not bleach. Lay flat to dry to preserve the shape and color depth.
                 </div>
               )}

               <button 
                 onClick={() => setActiveTab('shipping')}
                 className={`w-full py-5 px-6 text-left hover:bg-white-subtle/30 transition-colors flex justify-between items-center ${activeTab === 'shipping' ? 'text-white bg-white-subtle/10' : 'text-white-muted'}`}
               >
                 Shipping & Returns
                 <Plus size={16} className={`transition-transform duration-300 ${activeTab === 'shipping' ? 'rotate-45' : ''}`} />
               </button>
               {activeTab === 'shipping' && (
                 <div className="p-6 font-body text-white-muted text-sm normal-case tracking-normal border-b border-white-subtle bg-black-card">
                    <div className="flex items-start gap-4 mb-4">
                       <Truck className="text-crimson mt-1 shrink-0" size={20} />
                       <div>
                         <p className="text-white mb-1">Complimentary Delivery</p>
                         <p>Free standard shipping across Pakistan on all orders over PKR 3,000. Orders dispatch within 48 hours.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <RotateCcw className="text-crimson mt-1 shrink-0" size={20} />
                       <div>
                         <p className="text-white mb-1">Easy Returns</p>
                         <p>We accept returns within 7 days of delivery. Items must be unworn with original tags attached.</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 lg:px-8 mt-32">
          <div className="flex items-center justify-between mb-12 border-b border-black-border pb-6">
            <h2 className="font-display text-4xl text-white">COMPLETE THE LOOK</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
      
    </div>
  );
}

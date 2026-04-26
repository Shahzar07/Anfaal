'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: 'T-SHIRTS',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
  },
  {
    name: 'HOODIES',
    slug: 'hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  },
  {
    name: 'SWEATSHIRTS',
    slug: 'sweatshirts',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
  },
  {
    name: 'TRACKSUITS',
    slug: 'tracksuits',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
];

export function CategoryStrip() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-12 text-center">Shop by Category</h2>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/shop?category=${category.slug}`}
              className="relative w-72 lg:w-full shrink-0 group block aspect-[3/4] overflow-hidden snap-center"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="font-accent tracking-[0.2em] text-3xl text-white drop-shadow-lg group-hover:text-crimson transition-colors duration-300">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

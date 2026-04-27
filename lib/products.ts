import { Product } from './types';

export const products: Product[] = [
  {
    id: 'p-1',
    slug: 'shadow-drop-tee',
    name: 'Shadow Drop Tee',
    category: 't-shirts',
    price: 3500,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80'
    ],
    badge: 'NEW',
    description: 'An oversized silhouette crafted from heavyweight 240gsm cotton. Features dropped shoulders and a sleek, unstructured drape.',
    inStock: true,
  },
  {
    id: 'p-2',
    slug: 'void-hoodie',
    name: 'Void Hoodie',
    category: 'hoodies',
    price: 6500,
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80'
    ],
    badge: 'BESTSELLER',
    description: 'Our signature Void Hoodie. French terry interior with a matte black brushed exterior. Kangaroo pocket removed for a minimalist aesthetic.',
    inStock: true,
  },
  {
    id: 'p-3',
    slug: 'crimson-core-sweatshirt',
    name: 'Crimson Core Sweatshirt',
    category: 'sweatshirts',
    price: 4800,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      'https://picsum.photos/seed/p3_2/800/1000'
    ],
    description: 'A deep crimson crewneck that pairs perfectly with dark denim. Features ribbed cuffs and a subtle embroidered ANFAAL logo on the sleeve.',
    inStock: true,
  },
  {
    id: 'p-4',
    slug: 'stealth-tracksuit',
    name: 'Stealth Tracksuit',
    category: 'tracksuits',
    price: 12000,
    originalPrice: 14000,
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80'
    ],
    badge: 'SALE',
    description: 'A two-piece tactical set. Water-resistant nylon blend with articulated knee panels and zippered ankles for a customizable fit.',
    inStock: true,
  },
  {
    id: 'p-5',
    slug: 'monochrome-essential-tee',
    name: 'Monochrome Essential Tee',
    category: 't-shirts',
    price: 2800,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'
    ],
    description: 'Your everyday essential. A tailored fit through the chest with a regular hem. Premium ringspun cotton.',
    inStock: true,
  },
  {
    id: 'p-6',
    slug: 'midnight-pullover-hoodie',
    name: 'Midnight Pullover',
    category: 'hoodies',
    price: 6200,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80'
    ],
    description: 'Heavyweight loopback cotton designed to keep its shape. Double-lined hood gives it structure even when worn down.',
    inStock: true,
  },
  {
    id: 'p-7',
    slug: 'concrete-grey-sweatshirt',
    name: 'Concrete Grey Sweatshirt',
    category: 'sweatshirts',
    price: 4500,
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://picsum.photos/seed/p7/800/1000',
      'https://picsum.photos/seed/p7_2/800/1000'
    ],
    description: 'Pigment-dyed grey for a worn-in, vintage look. Boxy fit with dropped shoulders.',
    inStock: true,
  },
  {
    id: 'p-8',
    slug: 'urban-runner-tracksuit',
    name: 'Urban Runner Tracksuit',
    category: 'tracksuits',
    price: 11000,
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&q=80',
      'https://picsum.photos/seed/p8/800/1000'
    ],
    badge: 'NEW',
    description: 'Lightweight poly-spandex blend perfect for autumn runs or city commutes. Reflective piping for low-light visibility.',
    inStock: true,
  },
  {
    id: 'p-9',
    slug: 'blood-moon-graphic-tee',
    name: 'Blood Moon Graphic Tee',
    category: 't-shirts',
    price: 3800,
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'
    ],
    description: 'Features a subtle high-density print on the back. Washed down black cotton for a vintage feel.',
    inStock: true,
  },
  {
    id: 'p-10',
    slug: 'optic-white-hoodie',
    name: 'Optic White Hoodie',
    category: 'hoodies',
    price: 6500,
    originalPrice: 7500,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1572495641004-28421ae52e52?w=800&q=80',
      'https://picsum.photos/seed/p10/800/1000'
    ],
    badge: 'SALE',
    description: 'Pure stark white. Keep it clean. Features matte silver hardware on the aglets.',
    inStock: true,
  },
  {
    id: 'p-11',
    slug: 'onyx-crewneck',
    name: 'Onyx Crewneck',
    category: 'sweatshirts',
    price: 5200,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://picsum.photos/seed/p11/800/1000',
      'https://picsum.photos/seed/p11_2/800/1000'
    ],
    badge: 'BESTSELLER',
    description: 'Our most versatile sweatshirt. The Onyx Crewneck can be dressed up or down. Mercerized cotton exterior.',
    inStock: true,
  },
  {
    id: 'p-12',
    slug: 'tactical-cargo-tracksuit',
    name: 'Tactical Cargo Tracksuit',
    category: 'tracksuits',
    price: 13500,
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1543322748-33df6d3db806?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
    ],
    description: 'Heavyweight twill mixed with jersey panelling. Features 6 functional pockets on the bottoms and dual chest pockets on the jacket.',
    inStock: false,
  }
];

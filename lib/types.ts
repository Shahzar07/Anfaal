export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type Category = 't-shirts' | 'hoodies' | 'sweatshirts' | 'tracksuits';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  sizes: Size[];
  images: string[];
  badge?: 'NEW' | 'SALE' | 'BESTSELLER';
  description: string;
  inStock: boolean;
}

export interface CartItem {
  cartItemId: string; // unique generic id for cart entry (combines product id and size)
  product: Product;
  size: Size;
  quantity: number;
}

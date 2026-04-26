import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Size } from './types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: Size, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; totalItems: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, size, quantity = 1) => {
        const cartItemId = `${product.id}-${size}`;
        set((state) => {
          const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { cartItemId, product, size, quantity }],
            isOpen: true,
          };
        });
      },
      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        })),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setCartOpen: (isOpen) => set({ isOpen }),
      getTotals: () => {
        const items = get().items;
        return {
          subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
          totalItems: items.reduce((total, item) => total + item.quantity, 0),
        };
      },
    }),
    {
      name: 'anfaal-cart-storage',
    }
  )
);

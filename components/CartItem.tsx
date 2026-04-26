'use client';
import { CartItem as CartItemType } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  readonly?: boolean;
}

export function CartItem({ item, readonly = false }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.cartItemId, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-white-subtle">
      {/* Image */}
      <div className="w-24 h-32 relative bg-black-card flex-shrink-0">
        <Image 
          src={item.product.images[0]} 
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h4 className="font-display text-lg sm:text-xl text-white truncate">{item.product.name}</h4>
            {!readonly && (
              <button 
                onClick={() => removeItem(item.cartItemId)}
                className="text-white-muted hover:text-crimson transition-colors"
                aria-label="Remove item"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white-muted text-sm">{item.product.category}</span>
            <span className="w-1 h-1 rounded-full bg-white-subtle" />
            <span className="text-white-muted text-sm font-accent tracking-widest pt-0.5">SIZE {item.size}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          {readonly ? (
            <span className="text-white-muted font-light">Qty: {item.quantity}</span>
          ) : (
            <div className="flex items-center border border-white-subtle">
              <button 
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center text-white-muted hover:text-white hover:bg-white-subtle transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center text-white-muted hover:text-white hover:bg-white-subtle transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          
          <span className="font-light tracking-wide">
            PKR {(item.product.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingCart } from 'lucide-react';
import React from 'react';

export const CartButton: React.FC = () => {
  const { getTotalItems, openCart } = useCartStore();
  const itemCount = getTotalItems();

  return (
    <Button
      onClick={openCart}
      variant="outline"
      size="icon"
      className="relative border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-600 to-pink-600 border-0"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </Badge>
      )}
      <span className="sr-only">Shopping cart</span>
    </Button>
  );
};

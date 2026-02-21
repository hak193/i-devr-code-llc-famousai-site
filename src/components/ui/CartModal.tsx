import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { formatPrice, getLicenseDetails, useCartStore } from '@/lib/cart-store';
import type { LicenseType } from '@/types';
import { ShoppingCart, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CartModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateLicenseType,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-zinc-950 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-16 h-16 text-zinc-700 mb-4" />
                <p className="text-zinc-400 mb-2">Your cart is empty</p>
                <p className="text-zinc-500 text-sm mb-4">
                  Add some products to get started
                </p>
                <Button onClick={closeCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const licenseDetails = getLicenseDetails(item.license_type);
                const itemPrice = item.product.price_cents * licenseDetails.multiplier;

                return (
                  <div
                    key={`${item.product.id}-${item.license_type}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
                  >
                    {/* Product Info */}
                    <div className="flex gap-3 mb-3">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-zinc-400 text-sm truncate">
                          {item.product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.product.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Separator className="bg-zinc-800 mb-3" />

                    {/* License Type Selector */}
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">License Type</label>
                      <Select
                        value={item.license_type}
                        onValueChange={(value) =>
                          updateLicenseType(item.product.id, value as LicenseType)
                        }
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {(['personal', 'team', 'enterprise'] as LicenseType[]).map(
                            (type) => {
                              const details = getLicenseDetails(type);
                              const price =
                                item.product.price_cents * details.multiplier;
                              return (
                                <SelectItem key={type} value={type} className="text-white">
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <div className="font-medium">{details.label}</div>
                                      <div className="text-xs text-zinc-400">
                                        {details.description}
                                      </div>
                                    </div>
                                    <div className="ml-4 font-semibold">
                                      {formatPrice(price)}
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-zinc-400">
                        {licenseDetails.seats === -1
                          ? 'Unlimited seats'
                          : `${licenseDetails.seats} seat${licenseDetails.seats > 1 ? 's' : ''}`}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {formatPrice(itemPrice)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white font-medium">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <p className="text-xs text-center text-zinc-500">
                Secure checkout powered by Stripe
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

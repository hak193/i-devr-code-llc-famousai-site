import type { CartItem, LicenseType, Product } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, licenseType?: LicenseType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateLicenseType: (productId: string, licenseType: LicenseType) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, licenseType = 'personal') => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id && item.license_type === licenseType
        );

        if (existingItem) {
          // Increment quantity for digital products (max 1 per license type)
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.license_type === licenseType
                ? { ...item, quantity: 1 } // Digital products: quantity always 1
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1, license_type: licenseType }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      updateLicenseType: (productId, licenseType) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, license_type: licenseType } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price_cents;
          const multiplier = getLicenseMultiplier(item.license_type);
          return total + price * multiplier * item.quantity;
        }, 0);
      },

      getItemCount: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper function for license pricing
function getLicenseMultiplier(licenseType: LicenseType): number {
  switch (licenseType) {
    case 'personal':
      return 1;
    case 'team':
      return 3; // 3x price for team license (up to 10 seats)
    case 'enterprise':
      return 10; // 10x price for enterprise (unlimited seats)
    default:
      return 1;
  }
}

// Helper to format price
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

// Helper to get license details
export function getLicenseDetails(licenseType: LicenseType) {
  const details = {
    personal: {
      label: 'Personal License',
      description: 'For individual use',
      seats: 1,
      multiplier: 1,
    },
    team: {
      label: 'Team License',
      description: 'For teams up to 10 people',
      seats: 10,
      multiplier: 3,
    },
    enterprise: {
      label: 'Enterprise License',
      description: 'Unlimited seats',
      seats: -1, // -1 = unlimited
      multiplier: 10,
    },
  };

  return details[licenseType];
}

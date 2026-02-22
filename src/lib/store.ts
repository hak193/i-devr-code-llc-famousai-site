import type { CartItem, LicenseType, ModalState, Product, ProductFilters } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Store
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, licenseType?: LicenseType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateLicenseType: (productId: string, licenseType: LicenseType) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
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
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.license_type === licenseType
                ? { ...item, quantity: item.quantity + 1 }
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
          return total + item.product.price_cents * item.quantity;
        }, 0);
      },

      getItemCount: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    { name: 'idevr-cart-storage' }
  )
);

// Filter Store
interface FilterStore {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  category: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  tags: [],
  search: '',
  sortBy: 'popular'
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: defaultFilters })
}));

// UI Store
interface UIStore {
  modal: ModalState;
  openModal: (type: ModalState['type'], data?: unknown) => void;
  closeModal: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeView: 'store' | 'workbench' | 'dashboard';
  setActiveView: (view: 'store' | 'workbench' | 'dashboard') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  modal: { isOpen: false },
  openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),
  closeModal: () => set({ modal: { isOpen: false } }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeView: 'store',
  setActiveView: (view) => set({ activeView: view })
}));

// Prompt Editor Store
interface EditorStore {
  currentPromptId: string | null;
  content: string;
  variables: { [key: string]: string };
  isRunning: boolean;
  output: string;
  setCurrentPromptId: (id: string | null) => void;
  setContent: (content: string) => void;
  setVariable: (name: string, value: string) => void;
  setVariables: (variables: { [key: string]: string }) => void;
  setIsRunning: (running: boolean) => void;
  setOutput: (output: string) => void;
  appendOutput: (text: string) => void;
  clearOutput: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentPromptId: null,
  content: '',
  variables: {},
  isRunning: false,
  output: '',
  setCurrentPromptId: (id) => set({ currentPromptId: id }),
  setContent: (content) => set({ content }),
  setVariable: (name, value) =>
    set((state) => ({ variables: { ...state.variables, [name]: value } })),
  setVariables: (variables) => set({ variables }),
  setIsRunning: (running) => set({ isRunning: running }),
  setOutput: (output) => set({ output }),
  appendOutput: (text) => set((state) => ({ output: state.output + text })),
  clearOutput: () => set({ output: '' }),
  reset: () =>
    set({
      currentPromptId: null,
      content: '',
      variables: {},
      isRunning: false,
      output: ''
    })
}));

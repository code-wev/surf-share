import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            toast.error("Item is already in your cart");
            return state;
          }
          toast.success("Added to cart");
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      removeItems: (ids) =>
        set((state) => ({
          items: state.items.filter((i) => !ids.includes(i.id)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "surfshare-cart-storage",
    }
  )
);

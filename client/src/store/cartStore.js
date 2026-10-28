import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, color, size, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.product === product._id && item.color === color && item.size === size
        );
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({
            items: [...items, {
              product: product._id,
              title: product.title,
              slug: product.slug,
              image: product.images?.[0] || '',
              price: product.price,
              color,
              size,
              quantity,
            }]
          });
        }
      },

      removeItem: (index) => {
        const items = [...get().items];
        items.splice(index, 1);
        set({ items });
      },

      updateQuantity: (index, quantity) => {
        if (quantity < 1) return;
        const items = [...get().items];
        items[index].quantity = quantity;
        set({ items });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    { name: 'tommy-cart' }
  )
);

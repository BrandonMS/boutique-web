import { create } from 'zustand';

export const useCart = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addToCart: (product, quantity) => {
    const items = get().items;
    const existing = items.find((item) => item.id === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity,
      });
    }
    
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  
  removeFromCart: (productId) => {
    const items = get().items.filter((item) => item.id !== productId);
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const items = get().items;
    const item = items.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      set({ items });
      localStorage.setItem('cart', JSON.stringify(items));
    }
  },
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem('cart');
  },
}));

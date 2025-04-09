import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

export type ProductType = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  size?: string;
  color?: string;
  brand?: string;
  imageUrl: string;
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  reservedUntil?: Date;
}

export interface WishlistItem extends ProductType {
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  
  isInCart: (id: string) => boolean;
  isInWishlist: (id: string) => boolean;
  addToCart: (product: ProductType, quantity: number) => void;
  addToWishlist: (product: ProductType) => void;
  removeFromCart: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  cartItems: Array<{product: ProductType, quantity: number, reservedUntil: Date}>;
  wishlistItems: WishlistItem[];
  calculateCartTotal: () => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getTotalItems: () => 0,
  
  isInCart: () => false,
  isInWishlist: () => false,
  addToCart: () => {},
  addToWishlist: () => {},
  removeFromCart: () => {},
  removeFromWishlist: () => {},
  moveToCart: () => {},
  cartItems: [],
  wishlistItems: [],
  calculateCartTotal: () => 0
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  const isInCart = (id: string) => {
    return items.some(item => item.id === id);
  };
  
  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };
  
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      } else {
        return [...prevItems, item];
      }
    });
    
    toast.success(`${item.name} added to cart!`);
  };
  
  const addToCart = (product: ProductType, quantity: number) => {
    const item: CartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: quantity,
      image: product.imageUrl,
      size: product.size,
      color: product.color,
      reservedUntil: new Date(Date.now() + 15 * 60000)
    };
    
    addItem(item);
  };
  
  const addToWishlist = (product: ProductType) => {
    if (isInWishlist(product.id)) {
      return;
    }
    
    setWishlist(prevWishlist => [...prevWishlist, product]);
    toast.success(`${product.title} added to wishlist!`);
  };
  
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };
  
  const removeFromCart = removeItem;
  
  const removeFromWishlist = (id: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
    toast.info('Item removed from wishlist');
  };
  
  const moveToCart = (id: string) => {
    const product = wishlist.find(item => item.id === id);
    
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(id);
      toast.success(`${product.title} moved to cart!`);
    }
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };
  
  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateCartTotal = getSubtotal;
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const cartItems = items.map(item => ({
    product: {
      id: item.id,
      title: item.name,
      price: item.price,
      imageUrl: item.image,
      size: item.size,
      color: item.color,
      condition: '',
      category: ''
    },
    quantity: item.quantity,
    reservedUntil: item.reservedUntil || new Date(Date.now() + 15 * 60000)
  }));
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      getSubtotal,
      getTotalItems,
      isInCart,
      isInWishlist,
      addToCart,
      addToWishlist,
      removeFromCart,
      removeFromWishlist,
      moveToCart,
      cartItems,
      wishlistItems: wishlist,
      calculateCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

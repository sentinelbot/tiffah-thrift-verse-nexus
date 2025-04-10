import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CartItem, ProductType, WishlistItem } from '@/types';

export interface CartContextType {
  items: CartItem[];
  wishlistItems: WishlistItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  addToCart: (product: ProductType) => void;
  removeFromCart: (id: string) => void;
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      if (existingItemIndex >= 0) {
        // If item already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Otherwise add new item
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
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
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const addToCart = (product: ProductType) => {
    const newItem: CartItem = {
      id: product.id,
      name: product.name || product.title || '',
      price: product.price,
      imageUrl: product.imageUrl || '/placeholder.svg',
      quantity: 1,
      product,
      reservedUntil: new Date(Date.now() + 15 * 60 * 1000) // Reserved for 15 minutes
    };
    
    addItem(newItem);
    toast.success(`${newItem.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    removeItem(id);
    toast.info('Item removed from cart');
  };

  const addToWishlist = (product: ProductType) => {
    // Check if already in wishlist
    if (wishlistItems.some(item => item.id === product.id)) {
      toast.info('Item already in wishlist');
      return;
    }
    
    const newItem: WishlistItem = {
      id: product.id,
      name: product.name || product.title || '',
      price: product.price,
      imageUrl: product.imageUrl || '/placeholder.svg',
      addedOn: new Date(),
      originalPrice: product.originalPrice,
      size: product.size
    };
    
    setWishlistItems(prev => [...prev, newItem]);
    toast.success(`${newItem.name} added to wishlist`);
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from wishlist');
  };

  const moveToCart = (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      });
      removeFromWishlist(id);
      toast.success('Item moved to cart');
    }
  };

  const value = {
    items,
    wishlistItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

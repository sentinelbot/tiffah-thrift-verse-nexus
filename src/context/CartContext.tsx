
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductType, WishlistItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
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
  cartItems: CartItem[];
  calculateCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('tiffah-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('tiffah-cart');
      }
    }

    const savedWishlist = localStorage.getItem('tiffah-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        localStorage.removeItem('tiffah-wishlist');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tiffah-cart', JSON.stringify(items));
  }, [items]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tiffah-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists in the cart
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, item];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
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

  // Extended functions for compatibility
  const addToCart = (product: ProductType) => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    };
    
    addItem(item);
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const addToWishlist = (product: ProductType) => {
    setWishlistItems(currentItems => {
      // Check if item already exists in the wishlist
      const existingItemIndex = currentItems.findIndex(i => i.id === product.id);

      if (existingItemIndex > -1) {
        return currentItems;
      } else {
        const wishlistItem: WishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          addedOn: new Date()
        };
        toast.success(`${product.name} added to wishlist`);
        return [...currentItems, wishlistItem];
      }
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Item removed from wishlist');
  };

  const moveToCart = (id: string) => {
    const wishlistItem = wishlistItems.find(item => item.id === id);
    
    if (wishlistItem) {
      addToCart({
        id: wishlistItem.id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        imageUrl: wishlistItem.imageUrl
      });
      removeFromWishlist(id);
      toast.success(`${wishlistItem.name} moved to cart`);
    }
  };

  // Alias properties for compatibility
  const cartItems = items;
  const calculateCartTotal = getCartTotal;

  return (
    <CartContext.Provider 
      value={{ 
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
        moveToCart,
        cartItems,
        calculateCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

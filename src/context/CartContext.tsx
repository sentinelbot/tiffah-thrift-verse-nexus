
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductType } from '@/types';
import { toast } from 'sonner';

export interface CartItem {
  product: Product | ProductType;
  quantity: number;
  reservedUntil: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product | ProductType, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  addToWishlist: (product: Product | ProductType) => void;
  removeFromWishlist: (productId: string) => void;
  wishlist: (Product | ProductType)[];
  wishlistItems: (Product | ProductType)[]; // Alias for wishlist, for backward compatibility
  moveToCart: (productId: string) => void; // Added for Wishlist component
  cartItems: CartItem[]; // Alias for items, for backward compatibility
  calculateCartTotal: () => number; // Alias for getCartTotal, for backward compatibility
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<(Product | ProductType)[]>([]);

  // Load cart and wishlist from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('tiffah-cart');
    if (savedCart) {
      try {
        // Convert string dates back to Date objects
        const parsedCart = JSON.parse(savedCart, (key, value) => {
          if (key === 'reservedUntil' && value) {
            return new Date(value);
          }
          return value;
        });
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('tiffah-cart');
      }
    }

    const savedWishlist = localStorage.getItem('tiffah-wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        localStorage.removeItem('tiffah-wishlist');
      }
    }
  }, []);

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tiffah-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('tiffah-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product | ProductType, quantity: number) => {
    setItems(currentItems => {
      // Check if the product already exists in the cart
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

      // Set reservation expiry to 15 minutes from now
      const reservationTime = new Date();
      reservationTime.setMinutes(reservationTime.getMinutes() + 15);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          reservedUntil: reservationTime, // Reset the reservation time
        };
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, {
          product,
          quantity,
          reservedUntil: reservationTime
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const addToWishlist = (product: Product | ProductType) => {
    setWishlist(currentWishlist => {
      // Check if product already exists in wishlist
      if (currentWishlist.some(item => item.id === product.id)) {
        return currentWishlist;
      }
      return [...currentWishlist, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(currentWishlist => currentWishlist.filter(product => product.id !== productId));
  };

  const moveToCart = (productId: string) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(productId);
      toast.success(`${product.title || product.name} added to cart`);
    }
  };

  // Create the context value object
  const contextValue: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    wishlistItems: wishlist, // Alias for backward compatibility
    moveToCart,
    // Aliases for backward compatibility
    cartItems: items,
    calculateCartTotal: getCartTotal
  };

  return (
    <CartContext.Provider value={contextValue}>
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

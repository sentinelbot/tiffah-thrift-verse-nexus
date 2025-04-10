
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem as CartItemType } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
  reservedUntil: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product | CartItemType, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  addToWishlist: (product: Product | CartItemType) => void;
  removeFromWishlist: (productId: string) => void;
  wishlist: Product[];
  cartItems: CartItem[]; // Alias for items, for backward compatibility
  calculateCartTotal: () => number; // Alias for getCartTotal, for backward compatibility
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

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

  const addToCart = (product: Product | CartItemType, quantity: number) => {
    setItems(currentItems => {
      // Check if the product already exists in the cart
      // Safely extract the product ID based on the type
      const productId = 'id' in product ? product.id : '';
      const existingItemIndex = currentItems.findIndex(item => item.product.id === productId);

      // Set reservation expiry to 15 minutes from now
      const reservationTime = new Date();
      reservationTime.setMinutes(reservationTime.getMinutes() + 15);

      // Convert CartItemType to Product if needed
      let fullProduct: Product;
      if ('name' in product && !('barcode' in product)) {
        // It's a CartItemType, convert to a basic Product
        fullProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: 'unknown',
          condition: 'good' as 'new' | 'likeNew' | 'good' | 'fair',
          barcode: product.id, // Use ID as barcode
          status: 'available',
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false,
          imageUrl: product.imageUrl,
          title: product.name // For backward compatibility
        };
      } else {
        // It's already a Product
        fullProduct = product as Product;
      }

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
          product: fullProduct,
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

  const addToWishlist = (product: Product | CartItemType) => {
    setWishlist(currentWishlist => {
      // Convert CartItemType to Product if needed
      let fullProduct: Product;
      if ('name' in product && !('barcode' in product)) {
        // It's a CartItemType, convert to a basic Product
        fullProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: 'unknown',
          condition: 'good' as 'new' | 'likeNew' | 'good' | 'fair',
          barcode: product.id, // Use ID as barcode
          status: 'available',
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false,
          imageUrl: product.imageUrl,
          title: product.name // For backward compatibility
        };
      } else {
        // It's already a Product
        fullProduct = product as Product;
      }

      // Check if product already exists in wishlist
      if (currentWishlist.some(item => item.id === fullProduct.id)) {
        return currentWishlist;
      }
      return [...currentWishlist, fullProduct];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(currentWishlist => currentWishlist.filter(product => product.id !== productId));
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

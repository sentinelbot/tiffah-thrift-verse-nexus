import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, WishlistItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  calculateCartTotal: () => number;
  
  // Wishlist functionality
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  
  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('tiffah-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    
    // Load wishlist
    const savedWishlist = localStorage.getItem('tiffah-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
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
  
  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate cart total (keeping for backward compatibility)
  const calculateCartTotal = () => {
    return subtotal;
  };
  
  // Add an item to the cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success(`Updated quantity for ${item.name}`);
        return updatedItems;
      } else {
        // New item, add to cart
        toast.success(`Added ${item.name} to cart`);
        return [...prevItems, { 
          id: `cart-item-${Date.now()}`,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        }];
      }
    });
  };
  
  // Update an item's quantity
  const updateItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove an item from the cart
  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      
      return updatedItems;
    });
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
    toast.success('Cart has been cleared');
  };
  
  // Check if a product is already in the cart
  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId);
  };
  
  // Add a product to the wishlist
  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      if (prevItems.some(item => item.productId === product.id)) {
        toast.info(`${product.name} is already in your wishlist`);
        return prevItems;
      }
      
      toast.success(`Added ${product.name} to wishlist`);
      return [...prevItems, {
        id: `wishlist-item-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        addedAt: new Date(),
        originalPrice: product.originalPrice,
        size: product.size
      }];
    });
  };
  
  // Remove an item from the wishlist
  const removeFromWishlist = (id: string) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from wishlist`);
      }
      
      return updatedItems;
    });
  };
  
  // Check if a product is in the wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };
  
  // Move an item from wishlist to cart
  const moveToCart = (id: string) => {
    const wishlistItem = wishlistItems.find(item => item.id === id);
    
    if (wishlistItem) {
      // Create a minimal Product object required for type safety
      const product: Product = {
        id: wishlistItem.productId,
        name: wishlistItem.name,
        price: wishlistItem.price,
        imageUrl: wishlistItem.imageUrl,
        category: 'Unknown', // Required field for Product
        condition: 'Unknown', // Required field for Product
        barcode: 'Unknown', // Required field for Product
        status: 'available' // Required field for Product
      };
      
      // Add to cart
      addItem({
        id: `cart-item-${Date.now()}`,
        productId: wishlistItem.productId,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity: 1,
        imageUrl: wishlistItem.imageUrl
      });
      
      // Remove from wishlist
      removeFromWishlist(id);
      
      toast.success(`Moved ${wishlistItem.name} to cart`);
    }
  };
  
  const value = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isInCart,
    totalItems,
    subtotal,
    calculateCartTotal,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductType } from "@/components/products/ProductCard";

interface CartItem {
  product: ProductType;
  quantity: number;
  addedAt: Date;
  reservedUntil: Date;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: ProductType[];
  addToCart: (product: ProductType, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  calculateCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Number of minutes an item is reserved in cart
const RESERVATION_MINUTES = 15;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<ProductType[]>([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Convert string dates back to Date objects
        const cartWithDateObjects = parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          reservedUntil: new Date(item.reservedUntil)
        }));
        setCartItems(cartWithDateObjects);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }

    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
  }, []);

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Check for expired reservations
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const expiredItems = cartItems.filter(item => item.reservedUntil < now);
      
      if (expiredItems.length > 0) {
        const updatedCart = cartItems.filter(item => item.reservedUntil >= now);
        setCartItems(updatedCart);
        
        if (updatedCart.length !== cartItems.length) {
          toast.info("Some items in your cart have expired and were removed.");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [cartItems]);

  const addToCart = (product: ProductType, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
        reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60000)
      };
      setCartItems(updatedCart);
      toast.success(`Updated ${product.title} quantity in cart`);
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        addedAt: new Date(),
        reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60000)
      };
      setCartItems([...cartItems, newItem]);
      toast.success(`Added ${product.title} to cart`);
    }

    // Remove from wishlist if it's there
    removeFromWishlist(product.id);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.product.id === productId 
        ? { 
            ...item, 
            quantity,
            reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60000)
          } 
        : item
    );
    
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const addToWishlist = (product: ProductType) => {
    if (!wishlistItems.some(item => item.id === product.id)) {
      setWishlistItems([...wishlistItems, product]);
      toast.success(`Added ${product.title} to wishlist`);
    } else {
      toast.info("This item is already in your wishlist");
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
  };

  const moveToCart = (productId: string) => {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(productId);
      toast.success(`Moved ${product.title} to cart`);
    }
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInCart,
    isInWishlist,
    calculateCartTotal,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

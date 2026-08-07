import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, OrderItem, Coupon } from '../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartContextType {
  cartItems: OrderItem[];
  wishlistIds: string[];
  appliedCoupon: Coupon | null;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('app_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('app_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('app_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('app_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('app_coupon');
    }
  }, [appliedCoupon]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderAmount) {
      const calculated = (subtotal * appliedCoupon.discountPercent) / 100;
      discountAmount = Math.min(calculated, appliedCoupon.maxDiscount);
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: OrderItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: Math.min(product.stock, quantity),
          image: product.images[0] || '',
          heightInInches: product.heightInInches,
          material: product.material,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const q = query(collection(db, 'coupons'), where('code', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        return { success: false, message: 'Invalid coupon code.' };
      }

      const couponDoc = snap.docs[0];
      const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;

      if (!coupon.isActive) {
        return { success: false, message: 'This coupon is no longer active.' };
      }

      if (subtotal < coupon.minOrderAmount) {
        return {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`,
        };
      }

      setAppliedCoupon(coupon);
      return {
        success: true,
        message: `Coupon '${coupon.code}' applied! You saved ${coupon.discountPercent}%.`,
      };
    } catch (err) {
      console.error('Error applying coupon:', err);
      return { success: false, message: 'Failed to validate coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistIds,
        appliedCoupon,
        subtotal,
        discountAmount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

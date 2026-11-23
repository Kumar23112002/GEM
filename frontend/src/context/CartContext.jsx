import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCurrency } from './CurrencyContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentCurrency, convertPrice } = useCurrency();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('goeazy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('goeazy_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1, selectedPackSize = undefined) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedPackSize === selectedPackSize
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedPackSize === selectedPackSize
            ? { ...item, quantity: item.quantity + quantity, currency: product.currency || item.currency || 'AED' }
            : item
        );
      }
      return [...prev, { ...product, currency: product.currency || 'AED', quantity, selectedPackSize }];
    });
    showToast(`"${product.title}" added to cart!`);
  };

  const removeFromCart = (productId, selectedPackSize = undefined) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === productId && (selectedPackSize === undefined || item.selectedPackSize === selectedPackSize))
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, quantity, selectedPackSize = undefined) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedPackSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && (selectedPackSize === undefined || item.selectedPackSize === selectedPackSize)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('goeazy_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const targetCode = currentCurrency?.code || 'AED';
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemCurrency = item.currency || 'AED';
      const convertedUnit = convertPrice(item.price, itemCurrency, targetCode);
      return sum + convertedUnit * item.quantity;
    }, 0);
  }, [cart, targetCode, convertPrice]);

  const shippingThreshold = convertPrice(1000, 'INR', targetCode);
  const shippingRate = convertPrice(50, 'INR', targetCode);
  const shipping = subtotal === 0 ? 0 : subtotal > shippingThreshold ? 0 : Math.round(shippingRate * 100) / 100;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totals: { subtotal, shipping, tax, total },
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

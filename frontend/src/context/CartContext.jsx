import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('harvesthub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('harvesthub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (produce, batch, quantity = 1, isSurplus = false, surplusPrice = null) => {
    setCartItems((prev) => {
      // If adding from a different farm, warn or reset
      if (prev.length > 0 && prev[0].farmId !== produce.farmId) {
        if (!window.confirm(`Your cart already contains produce from "${prev[0].farmName}". Would you like to start a new basket from "${produce.farmName}"?`)) {
          return prev;
        }
        prev = [];
      }

      const existingIndex = prev.findIndex((item) => item.harvestBatchId === batch.id);
      const effectivePrice = isSurplus && surplusPrice ? Number(surplusPrice) : Number(produce.basePricePerUnit);

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + Number(quantity);
        // Cap at available batch quantity
        if (newQty > batch.availableQuantity) {
          alert(`Cannot add more than ${batch.availableQuantity} ${produce.unit} available in this batch.`);
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [
          ...prev,
          {
            produceId: produce.id,
            harvestBatchId: batch.id,
            batchNumber: batch.batchNumber,
            title: produce.title,
            cropVariety: produce.cropVariety,
            imageUrl: produce.imageUrl,
            unit: produce.unit,
            farmId: produce.farmId,
            farmName: produce.farmName,
            unitPrice: effectivePrice,
            quantity: Number(quantity),
            maxAvailable: batch.availableQuantity,
            isSurplus: isSurplus,
          },
        ];
      }
    });
  };

  const updateQuantity = (harvestBatchId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(harvestBatchId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.harvestBatchId === harvestBatchId) {
          const validQty = Math.min(quantity, item.maxAvailable || 9999);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (harvestBatchId) => {
    setCartItems((prev) => prev.filter((item) => item.harvestBatchId !== harvestBatchId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const farmId = cartItems.length > 0 ? cartItems[0].farmId : null;
  const farmName = cartItems.length > 0 ? cartItems[0].farmName : null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        farmId,
        farmName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

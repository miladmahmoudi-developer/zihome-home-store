import { useEffect, useState } from "react";
import { CartContext } from "./cartContext";

const CART_STORAGE_KEY = "zihome-cart";

/** Restore the last saved cart; invalid or missing browser data becomes empty. */
function readCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

/**
 * Owns cart state and exposes safe operations to the rest of the application.
 * Cart contents are saved in localStorage so a page refresh does not clear them.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  // Keep browser storage synchronized whenever cart contents change.
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, amount = 1) => {
    // Products with no stock cannot be added.
    if (product.stockCount < 1) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Increase an existing line without exceeding the available stock.
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + amount, product.stockCount),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(amount, product.stockCount),
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const changeQuantity = (productId, quantity) => {
    // A quantity of zero removes the line; positive values stay within stock.
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(quantity, item.stockCount),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


import { useContext } from "react";
import { CartContext } from "../context/cartContext";

/** Read the shared cart and fail early when a component is outside its provider. */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("pitha_cart") || "[]"));

  const loadCart = async () => {
    if (!token) return;
    const { data } = await api.get("/cart");
    setItems(data);
  };

  useEffect(() => {
    loadCart().catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) localStorage.setItem("pitha_cart", JSON.stringify(items));
  }, [items, token]);

  const addToCart = async (product, quantity = 1, size = null) => {
    if (token) {
      await api.post("/cart", { productId: product.id, quantity, size });
      await loadCart();
      return;
    }
    setItems((current) => {
      const match = current.find((item) => item.id === product.id && item.size === size);
      if (match) {
        return current.map((item) => (item === match ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [{ ...product, quantity, size }, ...current];
    });
  };

  const updateQuantity = async (item, quantity) => {
    if (token && item.cart_id) {
      await api.patch(`/cart/${item.cart_id}`, { quantity });
      await loadCart();
      return;
    }
    setItems((current) => current.map((cartItem) => (cartItem === item ? { ...cartItem, quantity } : cartItem)));
  };

  const removeFromCart = async (item) => {
    if (token && item.cart_id) {
      await api.delete(`/cart/${item.cart_id}`);
      await loadCart();
      return;
    }
    setItems((current) => current.filter((cartItem) => cartItem !== item));
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);

  const value = useMemo(
    () => ({ items, total, addToCart, updateQuantity, removeFromCart, clearCart, loadCart }),
    [items, total, token]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

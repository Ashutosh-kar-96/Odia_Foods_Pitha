import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    if (!token) {
      setItems([]);
      return;
    }
    const { data } = await api.get("/wishlist");
    setItems(data);
  };

  useEffect(() => {
    loadWishlist().catch(() => setItems([]));
  }, [token]);

  const isWishlisted = (productId) =>
    items.some((item) => Number(item.id) === Number(productId));

  const toggleWishlist = async (product) => {
    if (!token) {
      throw new Error("Please login to use wishlist");
    }
    if (isWishlisted(product.id)) {
      await api.delete(`/wishlist/${product.id}`);
      await loadWishlist();
      return "removed";
    } else {
      await api.post(`/wishlist/${product.id}`);
      await loadWishlist();
      return "added";
    }
  };

  const value = useMemo(
    () => ({ items, loadWishlist, toggleWishlist, isWishlisted }),
    [items, token],
  );
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

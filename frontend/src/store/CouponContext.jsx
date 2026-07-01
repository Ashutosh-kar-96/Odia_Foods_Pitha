import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CouponContext = createContext(null);
const defaultCoupon = { code: "", description: "", visible: false };

export const CouponProvider = ({ children }) => {
  const { user } = useAuth();
  const [coupon, setCoupon] = useState(defaultCoupon);

  const refreshPublic = async () => {
    try {
      const { data } = await api.get("/coupon");
      setCoupon(data);
    } catch {
      setCoupon(defaultCoupon);
    }
  };

  useEffect(() => {
    if (user) refreshPublic();
  }, [user]);

  const fetchAdminCoupon = async () => {
    const { data } = await api.get("/admin/coupon");
    return {
      code: data.code || "",
      description: data.description || "",
      visible: !!data.is_visible,
      discountType: data.discount_type || "percent",
      discountValue: Number(data.discount_value) || 0
    };
  };

  const saveCoupon = async ({ code, description, visible, discountType, discountValue }) => {
    await api.put("/admin/coupon", { code, description, visible, discountType, discountValue });
    await refreshPublic();
  };

  const toggleVisibility = async () => {
    await api.patch("/admin/coupon/visibility");
    await refreshPublic();
  };

  const applyCoupon = async (code, amount) => {
    const { data } = await api.post("/coupon/apply", { code, amount });
    return data;
  };

  const value = { coupon, saveCoupon, toggleVisibility, fetchAdminCoupon, applyCoupon };
  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
};

export const useCoupon = () => useContext(CouponContext);
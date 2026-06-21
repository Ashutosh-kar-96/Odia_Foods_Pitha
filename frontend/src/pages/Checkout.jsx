import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../store/CartContext";
import { money } from "../utils/format";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const payable = total + 30 + (total > 499 ? 0 : 49);

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    await api.post("/payments/razorpay-order", { amount: payable });
    await api.post("/orders", {
      items: items.map((item) => ({ ...item, product_id: item.id })),
      shippingAddress: address,
      paymentStatus: "Paid"
    });
    clearCart();
    navigate("/orders");
  };

  return (
    <section className="container-page py-12">
      <h1 className="section-title">Secure Checkout</h1>
      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-temple">Shipping Address</h2>
          <textarea className="input mt-5 min-h-40" required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Full name, phone, house number, locality, city, state, PIN" />
          <div className="mt-6 rounded-md bg-rice p-4 text-sm leading-6 text-ink/70">
            Razorpay integration is API-ready. If keys are not set in `.env`, checkout runs in safe demo mode and still creates the order.
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-temple/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-temple">Payment</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between gap-3">
                <span>{item.name} x {item.quantity}</span>
                <span>{money(Number(item.price) * Number(item.quantity))}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-temple/10 pt-5 text-xl font-bold">
            <span>Payable</span>
            <span>{money(payable)}</span>
          </div>
          <button disabled={loading || !items.length} className="btn-primary mt-6 w-full">{loading ? "Placing order..." : "Pay & Place Order"}</button>
        </aside>
      </form>
    </section>
  );
}

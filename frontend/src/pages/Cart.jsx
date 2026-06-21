import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { money } from "../utils/format";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (!items.length) {
    return (
      <section className="container-page py-20 text-center">
        <h1 className="section-title">Your Cart Is Empty</h1>
        <p className="mt-3 text-ink/70">Add your favorite Pithas and Panas before checkout.</p>
        <Link to="/catalog" className="btn-primary mt-6">Browse Catalog</Link>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="section-title">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div key={`${item.id}-${item.size}-${index}`} className="grid gap-4 rounded-lg border border-temple/10 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
              <img src={item.image_url} alt={item.name} className="aspect-square rounded-md object-cover" />
              <div>
                <h2 className="font-display text-2xl font-bold text-temple">{item.name}</h2>
                <p className="mt-1 text-sm text-ink/60">{item.size || item.category}</p>
                <p className="mt-2 font-bold">{money(item.price)}</p>
              </div>
              <div className="flex items-center gap-3 self-center">
                <button className="rounded-md border p-2" onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}><Minus size={16} /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button className="rounded-md border p-2" onClick={() => updateQuantity(item, item.quantity + 1)}><Plus size={16} /></button>
                <button className="rounded-md border p-2 text-sindoor" onClick={() => removeFromCart(item)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-temple/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-temple">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="flex justify-between"><span>Packing</span><span>{money(30)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{total > 499 ? "Free" : money(49)}</span></div>
          </div>
          <div className="mt-5 flex justify-between border-t border-temple/10 pt-5 text-xl font-bold">
            <span>Total</span>
            <span>{money(total + 30 + (total > 499 ? 0 : 49))}</span>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">Secure Checkout</Link>
        </aside>
      </div>
    </section>
  );
}

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";
import { money } from "../utils/format";

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);

  if (!items.length) {
    return (
      <section className="container-page py-20 text-center">
        <Heart className="mx-auto text-clay" size={44} />
        <h1 className="section-title mt-4">Your Wishlist Is Empty</h1>
        <p className="mt-3 text-ink/70">
          Save favorite Pithas and Panas to buy later.
        </p>
        <Link to="/catalog" className="btn-primary mt-6">
          Explore Foods
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="section-title">My Wishlist</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-lg border border-temple/10 bg-white shadow-sm"
          >
            <Link to={`/products/${item.slug}`}>
              <img
                src={item.image_url}
                alt={item.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </Link>
            <div className="p-5">
              <span className="rounded-full bg-haldi/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-temple">
                {item.category}
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-temple">
                {item.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/70">
                {item.short_description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-bold">{money(item.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const result = await addToCart(item);

                      if (result === "added") {
                        setToast({ emoji: "🛒", text: "Added to cart!" });
                        setTimeout(() => setToast(null), 3000);
                      }
                    }}
                    className="rounded-md bg-temple p-3 text-white"
                    title="Add to cart"
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <button
                    onClick={async () => {
                      const result = await toggleWishlist(item);

                      if (result === "removed") {
                        setToast({
                          emoji: "💔",
                          text: "Removed from wishlist!",
                        });
                        setTimeout(() => setToast(null), 3000);
                      }
                    }}
                    className="rounded-md border border-temple/10 p-3 text-sindoor"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          {toast.emoji} {toast.text}
        </div>
      )}
    </section>
  );
}

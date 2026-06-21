import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-temple text-white">
      <div className="motif-border">
        <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold">Odisha Pitha & Pana</h2>
            <p className="mt-4 max-w-md text-white/75">
              A digital marketplace and cultural encyclopedia for authentic Odia traditional foods, festival specials, and food stories.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Explore</h3>
            <div className="mt-4 grid gap-2 text-white/75">
              <Link to="/catalog">Product Catalog</Link>
              <Link to="/knowledge">Knowledge Hub</Link>
              <Link to="/cart">Shopping Cart</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Customer Care</h3>
            <p className="mt-4 text-white/75">Fresh-batch packing, shelf-life labels, invoice support, and tracked orders across India.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

const navItems = [
  ["Home", "/home"],
  ["Catalog", "/catalog"],
  ["Knowledge", "/knowledge"],
  ["Orders", "/orders"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  return (
    <header className="sticky top-0 z-40 border-b border-temple/10 bg-rice/90 backdrop-blur-xl">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/home" className="flex items-center gap-3" aria-label="Odisha Pitha home">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-temple font-display text-xl font-bold text-white">ଓ</span>
          <span>
            <span className="block font-display text-xl font-bold text-temple">Odisha Pitha</span>
            <span className="block text-xs font-medium uppercase tracking-[0.2em] text-clay">Pana Marketplace</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-temple" : "text-ink/70 hover:text-temple"}`
              }
            >
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="text-sm font-semibold text-temple">
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/wishlist" className="rounded-md border border-temple/10 p-3 text-temple" title="Wishlist">
            <Heart size={19} />
          </Link>
          <Link to="/cart" className="relative rounded-md border border-temple/10 p-3 text-temple" title="Cart">
            <ShoppingBag size={19} />
            {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-haldi px-2 text-xs font-bold text-ink">{count}</span>}
          </Link>
          {user ? (
            <button onClick={logout} className="btn-secondary py-2">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary py-2">
              <UserRound size={17} /> Login
            </Link>
          )}
        </div>

        <button className="rounded-md border border-temple/10 p-3 text-temple md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-temple/10 bg-rice md:hidden">
          <div className="container-page grid gap-3 py-5">
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-semibold text-temple">
                {label}
              </NavLink>
            ))}
            {isAdmin && <Link to="/admin" className="rounded-md px-3 py-2 font-semibold text-temple">Admin</Link>}
            <Link to="/cart" className="rounded-md px-3 py-2 font-semibold text-temple">Cart ({count})</Link>
            {user ? <button onClick={logout} className="btn-secondary">Logout</button> : <Link to="/login" className="btn-primary">Login</Link>}
          </div>
        </div>
      )}
    </header>
  );
}

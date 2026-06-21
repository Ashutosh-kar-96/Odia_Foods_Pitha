import { BarChart3, Boxes, IndianRupee, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { money } from "../utils/format";

const today = new Date().toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const initialForm = {
  name: "",
  slug: "",
  category: "Pitha",
  short_description: "",
  description: "",
  cultural_significance: "",
  ingredients: "",
  preparation: "",
  region_origin: "Odisha",
  nutrition: "",
  storage: "",
  shelf_life_days: 7,
  price: "",
  availability: "In Stock",
  sizes: "250g, 500g",
  image_url: "",
  festival_tag: "",
  stock: 20,
  manufacturing_date: today,
  expiry_date: nextWeek
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data)).catch(() => setStats(null));

  useEffect(() => {
    loadStats();
  }, []);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" ? { slug: makeSlug(value) } : {})
    }));
  };

  const submitFood = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.post("/admin/products", {
        ...form,
        shelf_life_days: Number(form.shelf_life_days),
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setMessage("Food item added successfully.");
      setForm(initialForm);
      await loadStats();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add food item.");
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    [IndianRupee, "Sales", money(stats?.totalSales || 0)],
    [BarChart3, "Orders", stats?.orders || 0],
    [Users, "Users", stats?.users || 0],
    [Boxes, "Products", stats?.products || 0]
  ];

  return (
    <section className="container-page py-12">
      <p className="font-semibold uppercase tracking-[0.2em] text-clay">Admin</p>
      <h1 className="section-title mt-2">Marketplace Dashboard</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([Icon, label, value]) => (
          <div key={label} className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
            <Icon className="text-sindoor" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink/55">{label}</p>
            <p className="mt-2 text-3xl font-bold text-temple">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-temple">Recent Orders</h2>
          <div className="mt-5 grid gap-3">
            {stats?.recentOrders?.length ? stats.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between rounded-md bg-rice p-4">
                <span className="font-semibold">{order.order_number}</span>
                <span>{money(order.total)}</span>
              </div>
            )) : <p className="text-ink/65">No recent orders yet.</p>}
          </div>
        </section>
        <section className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-temple">Admin Features Included</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-ink/70">
            <p>Manage products through `/api/admin/products` create/update endpoints.</p>
            <p>Upload image URLs from Cloudinary or MinIO and store them on product records.</p>
            <p>View users, orders, reviews, sales analytics, and stock-ready product metadata.</p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-temple/10 bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-temple">Add Food Item</h2>
        <p className="mt-2 text-sm text-ink/65">Create a new Pitha, Pana, sweet, or traditional Odisha delicacy for the marketplace.</p>
        <form onSubmit={submitFood} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <input className="input" required placeholder="Food name" value={form.name} onChange={(event) => update("name", event.target.value)} />
            <input className="input" required placeholder="Slug" value={form.slug} onChange={(event) => update("slug", event.target.value)} />
            <select className="input" value={form.category} onChange={(event) => update("category", event.target.value)}>
              <option>Pitha</option>
              <option>Pana</option>
              <option>Sweet</option>
              <option>Festival Special</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <input className="input" required type="number" placeholder="Price" value={form.price} onChange={(event) => update("price", event.target.value)} />
            <input className="input" required type="number" placeholder="Stock" value={form.stock} onChange={(event) => update("stock", event.target.value)} />
            <input className="input" required type="number" placeholder="Shelf life days" value={form.shelf_life_days} onChange={(event) => update("shelf_life_days", event.target.value)} />
            <select className="input" value={form.availability} onChange={(event) => update("availability", event.target.value)}>
              <option>In Stock</option>
              <option>Seasonal</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input className="input" required placeholder="Sizes, e.g. 250g, 500g" value={form.sizes} onChange={(event) => update("sizes", event.target.value)} />
            <input className="input" required placeholder="Festival tag" value={form.festival_tag} onChange={(event) => update("festival_tag", event.target.value)} />
            <input className="input" required placeholder="Region of origin" value={form.region_origin} onChange={(event) => update("region_origin", event.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input" required type="date" value={form.manufacturing_date} onChange={(event) => update("manufacturing_date", event.target.value)} />
            <input className="input" required type="date" value={form.expiry_date} onChange={(event) => update("expiry_date", event.target.value)} />
          </div>
          <input className="input" required placeholder="Image URL from Cloudinary, MinIO, or any public image URL" value={form.image_url} onChange={(event) => update("image_url", event.target.value)} />
          <input className="input" required placeholder="Short description" value={form.short_description} onChange={(event) => update("short_description", event.target.value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <textarea className="input min-h-28" required placeholder="Detailed description" value={form.description} onChange={(event) => update("description", event.target.value)} />
            <textarea className="input min-h-28" required placeholder="Cultural significance" value={form.cultural_significance} onChange={(event) => update("cultural_significance", event.target.value)} />
            <textarea className="input min-h-28" required placeholder="Ingredients" value={form.ingredients} onChange={(event) => update("ingredients", event.target.value)} />
            <textarea className="input min-h-28" required placeholder="Preparation process" value={form.preparation} onChange={(event) => update("preparation", event.target.value)} />
            <textarea className="input min-h-28" required placeholder="Nutritional information" value={form.nutrition} onChange={(event) => update("nutrition", event.target.value)} />
            <textarea className="input min-h-28" required placeholder="Storage instructions" value={form.storage} onChange={(event) => update("storage", event.target.value)} />
          </div>
          {message && <p className="rounded-md bg-haldi/20 p-3 text-sm font-semibold text-temple">{message}</p>}
          <button disabled={saving} className="btn-primary w-fit">{saving ? "Adding..." : "Add Food Item"}</button>
        </form>
      </section>
    </section>
  );
}

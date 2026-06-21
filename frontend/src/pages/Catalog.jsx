import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import LoadingGrid from "../components/LoadingGrid";
import ProductCard from "../components/ProductCard";
import { fallbackProducts } from "../data/fallbackProducts";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    availability: "",
    festival: searchParams.get("festival") || "",
    maxShelfLife: "",
    maxPrice: "",
    sort: "popularity"
  });

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params })
      .then(({ data }) => setProducts(data))
      .catch(() => {
        const filtered = fallbackProducts.filter((product) =>
          (!filters.category || product.category === filters.category) &&
          (!filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase()))
        );
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-clay">Catalog</p>
          <h1 className="section-title mt-2">All Odisha Pithas, Panas and Sweets</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-clay" size={18} />
          <input className="input pl-10" placeholder="Search Arisa, Bela Pana..." value={filters.search} onChange={(event) => update("search", event.target.value)} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-temple/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold text-temple">Filters</h2>
          <div className="mt-5 grid gap-4">
            <select className="input" value={filters.category} onChange={(event) => update("category", event.target.value)}>
              <option value="">All categories</option>
              <option value="Pitha">Pitha</option>
              <option value="Pana">Pana</option>
              <option value="Sweet">Sweet</option>
            </select>
            <select className="input" value={filters.availability} onChange={(event) => update("availability", event.target.value)}>
              <option value="">Any availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Seasonal">Seasonal</option>
            </select>
            <input className="input" placeholder="Festival special" value={filters.festival} onChange={(event) => update("festival", event.target.value)} />
            <input className="input" type="number" placeholder="Max shelf life days" value={filters.maxShelfLife} onChange={(event) => update("maxShelfLife", event.target.value)} />
            <input className="input" type="number" placeholder="Max price" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} />
            <select className="input" value={filters.sort} onChange={(event) => update("sort", event.target.value)}>
              <option value="popularity">Popularity</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
              <option value="shelf_life">Shelf life</option>
            </select>
          </div>
        </aside>

        <div>
          {loading ? (
            <LoadingGrid />
          ) : products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="rounded-lg border border-temple/10 bg-white p-10 text-center">
              <h2 className="font-display text-2xl font-bold text-temple">No products found</h2>
              <p className="mt-2 text-ink/70">Try changing the filters or searching another festival item.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

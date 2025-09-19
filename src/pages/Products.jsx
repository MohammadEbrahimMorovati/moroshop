import { useMemo, useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Products() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast({ type: "error", message: "خطا در بارگذاری محصولات" });
        setLoading(false);
      });
  }, [toast]);
  const categories = useMemo(
    () => ["همه", ...Array.from(new Set(list.map((p) => p.category)))],
    [list]
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      const matchC = category === "همه" || p.category === category;
      const priceOk =
        (minPrice === "" || p.price >= Number(minPrice)) &&
        (maxPrice === "" || p.price <= Number(maxPrice));
      return matchQ && matchC && priceOk;
    });
  }, [list, query, category, minPrice, maxPrice]);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">🛍️ محصولات</h2>
        <p>در حال بارگذاری...</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8">🛍️ محصولات</h2>

      {/* فیلترها */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {/* سرچ */}
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="جست‌وجوی محصول..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* دسته‌بندی */}
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* قیمت از ... تا ... */}
        <div className="sm:col-span-3 grid grid-cols-2 gap-4">
          <input
            type="number"
            min="0"
            placeholder="حداقل قیمت"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="number"
            min="0"
            placeholder="حداکثر قیمت"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      {/* لیست محصولات */}
      <ProductGrid
        products={filtered}
        onAdd={(p) => {
          addItem(p, 1);
          toast({
            type: "success",
            message: `«${p.title}» به سبد اضافه شد 🛒`,
          });
        }}
      />
    </section>
  );
}

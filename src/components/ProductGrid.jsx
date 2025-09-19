import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onAdd }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        هیچ محصولی یافت نشد 🙁
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}

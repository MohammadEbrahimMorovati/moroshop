import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col">
      {/* تصویر محصول */}
      <Link
        to={`/products/${product.id}`}
        className="flex items-center justify-center bg-white rounded-lg overflow-hidden h-48 mb-4"
      >
        <img
          src={product.image}
          alt={product.title}
          className="max-h-44 object-contain transition-transform hover:scale-105"
        />
      </Link>

      {/* اطلاعات */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
          <Link to={`/products/${product.id}`} className="hover:text-red-500">
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto">
          <span className="block text-red-600 font-bold text-lg mb-3">
            {product.price.toLocaleString()} تومان
          </span>

          <button
            onClick={() => onAdd(product)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium shadow-md transition-transform hover:scale-105"
          >
            افزودن به سبد 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

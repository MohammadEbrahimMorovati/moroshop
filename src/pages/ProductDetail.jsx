import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast({ type: "error", message: "خطا در بارگذاری محصول" });
        setLoading(false);
      });
  }, [id, toast]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">در حال بارگذاری...</h2>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">❌ محصول یافت نشد</h2>
        <p className="text-gray-500">محصول مورد نظر وجود ندارد.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* تصویر */}
      <div className="flex items-center justify-center bg-white rounded-xl border shadow-sm p-6">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-96 object-contain"
        />
      </div>

      {/* اطلاعات */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <p className="text-red-600 text-xl font-semibold mb-6">
            {product.price.toLocaleString()} تومان
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description}
          </p>
        </div>

        <button
          className="w-full rounded-lg bg-red-500 hover:bg-red-600 text-white py-3 font-semibold shadow-md transition-transform hover:scale-105"
          onClick={() => {
            addItem(product, 1);
            toast({
              type: "success",
              message: `«${product.title}» به سبد اضافه شد 🛒`,
            });
          }}
        >
          افزودن به سبد خرید
        </button>
      </div>
    </section>
  );
}

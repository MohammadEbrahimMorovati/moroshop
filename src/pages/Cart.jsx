import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Cart() {
  const { items, removeItem, updateQuantity, totals } = useCart();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <section className="max-w-5xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">🛒 سبد خرید</h2>
        <p className="text-gray-500 mb-6">سبد خرید شما خالی است.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 font-semibold shadow-md transition"
        >
          ➕ مشاهده محصولات
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 border-b pb-3 text-pink-600">
        🛍️ سبد خرید
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-6 border rounded-xl p-4 hover:shadow-md transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-28 h-28 object-contain rounded-lg border"
              />
              <div className="flex-1">
                <h3 className="text-base font-semibold line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  قیمت:{" "}
                  <span className="font-medium text-pink-600">
                    {product.price.toLocaleString()} تومان
                  </span>
                </p>

                {/* کنترل تعداد */}
                <div className="flex items-center mt-3 gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(product.id, Number(e.target.value) || 1)
                    }
                    className="w-14 text-center border rounded-lg py-1"
                  />
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* دکمه حذف */}
                <button
                  onClick={() => {
                    removeItem(product.id);
                    toast({ type: "info", message: "آیتم از سبد حذف شد." });
                  }}
                  className="mt-3 text-sm text-pink-500 hover:underline"
                >
                  ❌ حذف از سبد
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* خلاصه سفارش */}
        <div className="border rounded-xl p-6 shadow-sm bg-gray-50">
          <h3 className="text-lg font-bold mb-4 text-pink-600">خلاصه سفارش</h3>

          <div className="flex justify-between mb-3">
            <span>جمع کل</span>
            <span className="font-semibold text-gray-800">
              {totals.subtotal.toLocaleString()} تومان
            </span>
          </div>

          <div className="flex justify-between mb-6 text-sm text-gray-500">
            <span>هزینه ارسال</span>
            <span>محاسبه در مرحله بعد</span>
          </div>

          <Link
            to="/checkout"
            className="block w-full text-center rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 font-semibold shadow-md transition"
          >
            ادامه فرایند خرید
          </Link>

          <Link
            to="/products"
            className="block w-full text-center mt-3 rounded-lg border border-gray-300 hover:bg-gray-100 px-6 py-3 font-medium transition"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </section>
  );
}

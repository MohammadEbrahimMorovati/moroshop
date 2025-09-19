import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "نام الزامی است";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "ایمیل معتبر نیست";
    if (form.address.trim().length < 10)
      e.address = "آدرس باید حداقل ۱۰ کاراکتر باشد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items,
          total: totals.subtotal,
          shippingAddress: form,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "خطا در ثبت سفارش");
      }
      setSuccess(true);
      clear();
      toast({ type: "success", message: "سفارش با موفقیت ثبت شد" });
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast({ type: "error", message: err.message || "خطا در ثبت سفارش" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <section className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">تسویه حساب</h2>
        <p className="text-gray-500">سبد خرید خالی است.</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8">🧾 تسویه حساب</h2>

      {success ? (
        <div className="p-6 rounded-xl bg-green-100 text-green-700 font-semibold text-center shadow">
          ✅ سفارش شما با موفقیت ثبت شد.
        </div>
      ) : (
        <>
          {/* خلاصه سفارش */}
          <div className="mb-8 p-4 rounded-xl border bg-gray-50 shadow-sm">
            <p className="flex justify-between text-lg font-semibold">
              <span>جمع کل:</span>
              <span className="text-red-600">
                {totals.subtotal.toLocaleString()} تومان
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              هزینه ارسال در مرحله بعد محاسبه می‌شود.
            </p>
          </div>

          {/* فرم اطلاعات */}
          <form
            onSubmit={submit}
            className="space-y-6 bg-white border rounded-xl shadow-md p-6"
          >
            {/* نام */}
            <div>
              <label className="block font-medium mb-2">
                نام و نام خانوادگی
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثلاً علی رضایی"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* ایمیل */}
            <div>
              <label className="block font-medium mb-2">ایمیل</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* آدرس */}
            <div>
              <label className="block font-medium mb-2">آدرس کامل</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="تهران، خیابان ...، پلاک ...، واحد ..."
                className="w-full border rounded-lg px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-red-400 outline-none"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* دکمه ثبت */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-500 hover:bg-red-600 text-white py-3 font-semibold shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "در حال ثبت..." : "ثبت سفارش"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}

import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "نام الزامی است";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "ایمیل معتبر نیست";
    if (form.password.length < 6) e.password = "رمز عبور حداقل ۶ کاراکتر است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await register(form);
      toast({ type: "success", message: "ثبت‌نام با موفقیت انجام شد 🎉" });
      navigate(from, { replace: true });
    } catch (err) {
      toast({ type: "error", message: err.message || "خطای ثبت‌نام" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          ایجاد حساب کاربری
        </h2>
        <form onSubmit={submit} className="space-y-5">
          {/* نام */}
          <div>
            <label className="block mb-1 font-medium">نام و نام خانوادگی</label>
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
            <label className="block mb-1 font-medium">ایمیل</label>
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

          {/* رمز عبور */}
          <div>
            <label className="block mb-1 font-medium">رمز عبور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="******"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "مخفی" : "نمایش"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            مرا به خاطر بسپار
          </label>

          {/* دکمه ثبت‌نام */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        {/* لینک ورود */}
        <p className="text-center mt-6 text-sm text-gray-600">
          حساب دارید؟{" "}
          <Link
            to="/login"
            className="text-red-500 font-medium hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </section>
  );
}

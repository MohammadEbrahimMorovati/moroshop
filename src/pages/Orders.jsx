import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Orders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e) {
        toast({ type: "error", message: "خطا در دریافت سفارش‌ها" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, toast]);

  if (loading) {
    return (
      <section className="container">
        <h2>سفارش‌ها</h2>
        <p>در حال بارگذاری...</p>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p>سفارشی ثبت نشده است.</p>
      ) : (
        <div className="grid" style={{ gap: 16 }}>
          {orders.map((o) => (
            <div key={o._id || o.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>شماره سفارش:</strong>
                <span>{o._id || o.id}</span>
              </div>
              <div>تاریخ: {new Date(o.createdAt).toLocaleString("fa-IR")}</div>
              <div>وضعیت: {o.status || "pending"}</div>
              <div>جمع کل: {o.total?.toLocaleString()} تومان</div>
              <ul style={{ marginTop: 8 }}>
                {(o.items || []).map((it, idx) => (
                  <li key={idx}>
                    {it.product?.title} × {it.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

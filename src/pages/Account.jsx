import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast({ type: "info", message: "با موفقیت خارج شدید" });
    navigate("/", { replace: true });
  };

  return (
    <section className="container" style={{ maxWidth: 720 }}>
      <h2>حساب کاربری</h2>
      <div className="card" style={{ padding: 16 }}>
        <div>نام: {user?.name}</div>
        <div>ایمیل: {user?.email}</div>
      </div>
      <button className="btn" style={{ marginTop: 12 }} onClick={onLogout}>
        خروج از حساب
      </button>
    </section>
  );
}

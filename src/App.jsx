import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Orders from "./pages/Orders.jsx";
import "./App.css";

function Header() {
  return (
    <header className="container">
      <nav className="nav">
        <Link to="/" className="brand">
          OnlineShop
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>
            خانه
          </NavLink>
          <NavLink to="/products">محصولات</NavLink>
          <NavLink to="/cart">سبد خرید</NavLink>
          <NavLink to="/account">حساب</NavLink>
          <NavLink to="/orders">سفارش‌ها</NavLink>
          <AuthMenu />
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} OnlineShop</p>
    </footer>
  );
}

function AuthMenu() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  return user ? (
    <>
      <span style={{ opacity: 0.8 }}>سلام، {user.name}</span>
      <button
        className="btn"
        onClick={() => {
          logout();
          toast({ type: "info", message: "خارج شدید" });
        }}
        style={{ padding: "6px 10px" }}
      >
        خروج
      </button>
    </>
  ) : (
    <>
      <NavLink to="/login">ورود</NavLink>
      <NavLink to="/register">ثبت‌نام</NavLink>
    </>
  );
}

// صفحات داخلی به فایل‌های مجزا منتقل شدند

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RequireGuest>
                      <Login />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RequireGuest>
                      <Register />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <Account />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RequireAuth>
                      <Orders />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function RequireGuest({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default App;

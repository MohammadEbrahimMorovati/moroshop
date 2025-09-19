import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const rawLocal = localStorage.getItem(STORAGE_KEY);
      const rawSession = sessionStorage.getItem(STORAGE_KEY);
      const raw = rawLocal ?? rawSession;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      // اگر قبلاً remember=false بوده، در session نگه داشته می‌شود
      const inSession = sessionStorage.getItem(STORAGE_KEY) != null;
      const storage = inSession ? sessionStorage : localStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async ({ email, password, remember = true }) => {
    if (!email || !password) throw new Error("ایمیل و رمز عبور الزامی است");
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || "خطای ورود");
    }
    const { token, user } = await res.json();
    const nextUser = { ...user, token };
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(nextUser);
    return true;
  }, []);

  const register = useCallback(
    async ({ name, email, password, remember = true }) => {
      if (!name || !email || !password)
        throw new Error("همه فیلدها الزامی است");
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "خطای ثبت‌نام");
      }
      const { token, user } = await res.json();
      const nextUser = { ...user, token };
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        localStorage.removeItem(STORAGE_KEY);
      }
      setUser(nextUser);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

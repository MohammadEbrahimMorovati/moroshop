import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function sign(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "توکن یافت نشد" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "توکن نامعتبر است" });
  }
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "همه فیلدها الزامی است" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "کاربر وجود دارد" });

    const user = new User({ name, email, password });
    await user.save();

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "نام کاربری یا رمز نادرست" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "نام کاربری یا رمز نادرست" });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({
    user: { id: req.user.sub, name: req.user.name, email: req.user.email },
  });
});

// Admin role support (simple): add ?makeAdmin=1 on first user to promote
router.post("/seed-admin", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "ایمیل لازم است" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    user.role = "admin";
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "خطای سرور" });
  }
});

export default router;

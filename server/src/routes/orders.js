import { Router } from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

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

router.post("/", auth, async (req, res) => {
  try {
    const { items = [], total = 0, shippingAddress } = req.body || {};
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "سبد خرید خالی است" });

    const order = new Order({
      user: req.user.sub,
      items,
      total,
      shippingAddress,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Get user orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.sub })
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

export default router;

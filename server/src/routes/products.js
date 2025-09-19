import { Router } from "express";
import { products } from "../data/products.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((p) => String(p.id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: "محصول یافت نشد" });
  res.json(product);
});

export default router;

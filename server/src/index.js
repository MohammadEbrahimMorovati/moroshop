import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "onlineshop", version: "1.0.0" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// Connect to database
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);

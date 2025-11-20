import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Routes
import authRoutes from "./modules/auth/auth.route";
import productRoutes from "./modules/products/products.route";

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

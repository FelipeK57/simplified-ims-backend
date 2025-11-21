import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./products.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, createProduct);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
export default router;
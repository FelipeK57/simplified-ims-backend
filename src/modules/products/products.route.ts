import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./products.controller";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const storeId = req.auth?.storeId;
    const { name, code, description, price, cost, stock, category } = req.body;
    if (!name || !code || !price || !category) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }
    const existingProduct = await prisma.product.findFirst({
      where: { code, storeId: Number(storeId) },
    });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Un producto con este código ya existe" });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        code,
        description: description || "",
        price: Number(price),
        cost: Number(cost) || 0,
        stock: Number(stock) || 0,
        category,
        storeId: Number(storeId),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const storeId = req.auth?.storeId;
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        storeId: Number(storeId),
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const storeId = req.auth?.storeId;
    const { id } = req.params;
    const { name, code, description, price, cost, stock, category } = req.body;

    const productToUpdate = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    
    if (!productToUpdate) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const productWithSameCode = await prisma.product.findFirst({
      where: { code, storeId: Number(storeId), id: { not: Number(id) } },
    });
    if (productWithSameCode) {
      return res
        .status(409)
        .json({ message: "Otro producto con este código ya existe" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        code,
        price: Number(price),
        cost: Number(cost),
        stock: Number(stock),
        category,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

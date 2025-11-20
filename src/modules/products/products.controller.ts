import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, code, userId } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }
    const existingProduct = await prisma.product.findFirst({
      where: { code, userId: Number(userId) },
    });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Un producto con este código ya existe" });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        code,
        userId: Number(userId),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: Number(userId),
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
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
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, code } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, code },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

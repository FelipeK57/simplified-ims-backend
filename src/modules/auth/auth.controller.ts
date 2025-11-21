import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register a new user and store
export const register = async (req: Request, res: Response) => {
  try {
    const { username, storeName, email, password } = req.body;

    if (!username || !storeName || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con este correo electrónico." });
    }

    const existingStore = await prisma.store.findFirst({
      where: { name: storeName },
    });
    if (existingStore) {
      return res
        .status(409)
        .json({ message: "Ya existe una tienda con este nombre." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStore = await prisma.store.create({ data: { name: storeName } });

    const newUser = await prisma.user.create({
      data: {
        name: username,
        storeId: newStore.id,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Usuario y tienda creados exitosamente",
      user: newUser,
      store: newStore,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatiorios" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { store: true },
    });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
        storeId: user.storeId,
        storeName: user.store.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user: user, jwt: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

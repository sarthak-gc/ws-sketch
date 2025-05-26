import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error creating user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, "secret");
      return res.status(200).send({ token });
    }
    res.status(401).send({ message: "Invalid password" });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error logging out", error });
  }
};

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import { generateColor } from "../utils/hexcode";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (userExists) {
      res.status(500).json({
        status: "error",
        message:
          "User with that username or email already exists, try different username or email",
      });
      return;
    }
    const hexCode = generateColor(username);
    const user = await prisma.user.create({
      data: {
        hexCode,
        username,
        password: hashedPassword,
        email,
      },
    });

    const token = jwt.sign(
      { username, userId: user.userId },
      (process.env.JWT_SECRET as string) || "SECRET"
    );
    res.cookie("token", token, { httpOnly: true });
    res.json({
      message: "User created successfully",
      userId: user.userId,
      username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { username, userId: user.userId },
        (process.env.JWT_SECRET as string) || "SECRET"
      );
      res.cookie("token", token, { httpOnly: true });
      res.json({ username, userId: user.userId });
      return;
    }
    res.status(401).json({ message: "Invalid password" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

export const seedUser = async (req: Request, res: Response) => {
  for (let i = 1; i < 27; i++) {
    const username = String.fromCharCode(96 + i);
    const hexCode = generateColor(username);
    const email = username + "@" + username + "." + username;
    const hashedPassword = await bcrypt.hash(username, 10);

    await prisma.user.create({
      data: {
        hexCode,
        username,
        password: hashedPassword,
        email,
      },
    });
  }

  res.json({
    msg: "Seeded",
  });
  return;
};

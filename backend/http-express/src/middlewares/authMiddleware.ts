import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["token"];

  if (!token) {
    res.status(403).json({
      status: "error",
      message: "Authorization failed, login to continue",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      (process.env.JWT_SECRET as string) || "SECRET"
    ) as JwtPayload & { userId: string };

    const user = await prisma.user.findFirst({
      where: {
        userId: decoded.userId,
      },
    });
    if (!user) {
      res.status(403).json({
        status: "error",
        message: "User not found, Try logging in again",
      });
      return;
    }
    req.userId = decoded.userId;

    next();
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

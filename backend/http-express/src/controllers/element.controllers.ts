import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const addElement = async (req: Request, res: Response) => {
  const element = req.body.element;
  const tabId = req.body.tabId;
  const shape = req.body.shape;
  if (!element.trim() || !tabId) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
    return;
  }
  const tab = await prisma.tabs.findFirst({
    where: {
      tabId,
    },
  });
  if (!tab) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
    return;
  }
  await prisma.element.create({
    data: {
      tabId,
      shape,
      creatorId: req.userId,
    },
  });
  res.json({
    status: "success",
  });
  return;
};
export const removeElement = async (req: Request, res: Response) => {
  const elementId = req.params.elementId;
  const element = await prisma.element.findFirst({
    where: {
      elementId,
    },
  });
  if (!element) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
    return;
  }
  await prisma.element.delete({
    where: {
      elementId,
    },
  });
  res.json({ status: "success" });

  return;
};

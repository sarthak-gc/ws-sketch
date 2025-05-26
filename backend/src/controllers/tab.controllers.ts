import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const getAllTabs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabs = await prisma.tabs.findMany({
      where: {
        userId,
      },
      select: {
        tabId: true,
        tabName: true,
        isPrivate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      data: {
        tabs,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const createTab = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    await prisma.tabs.create({ data: { userId } });
    res.json({
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const removeTab = async (req: Request, res: Response) => {
  try {
    const tabId = req.params.tabId;
    const userId = req.userId;

    const tab = await prisma.tabs.findUnique({ where: { tabId } });

    if (!tab || tab.userId !== userId) {
      res.status(403).json({ status: "error", message: "Unauthorized" });
      return;
    }
    await prisma.tabs.delete({ where: { tabId } });
    res.json({
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const changeTabName = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabId = req.params.tabId;
    const { tabName } = req.body;
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        tabName,
      },
    });
    if (updatedTab.count === 0) {
      res.status(404).json({ status: "error", message: "Tab not found" });
      return;
    }

    res.json({
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const changeTabEditMode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabId = req.params.tabId;
    const { isEditable } = req.body;
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        isEditable,
      },
    });
    if (updatedTab.count === 0) {
      res.status(404).json({ status: "error", message: "Tab not found" });
      return;
    }
    res.json({
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const changeTabVisibility = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabId = req.params.tabId;
    const { isPrivate } = req.body;
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        isPrivate,
      },
    });
    if (updatedTab.count === 0) {
      res.status(404).json({ status: "error", message: "Tab not found" });
      return;
    }
    res.json({
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const generateAccessCode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabId = req.params.tabId;
    const { duration } = req.body;
    const accessCode = Math.random().toString(36).substring(2, 8);
    const expirationTime = new Date();

    switch (duration) {
      case "30m":
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        break;
      case "1h":
        expirationTime.setHours(expirationTime.getHours() + 1);
        break;
      default:
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    }

    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        accessCode,
        accessCodeExpiration: expirationTime,
      },
    });

    if (updatedTab.count === 0) {
      res.status(404).json({ status: "error", message: "Tab not found" });
      return;
    }
    res.json({
      status: "success",
      data: {
        accessCode,
        expiresAt: expirationTime,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const getTabDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { tabId } = req.params;
    const tab = await prisma.tabs.findUnique({
      where: { tabId },
      include: { Collaborators: true },
    });
    if (!tab) {
      res.status(404).send({ message: "Tab not found" });
      return;
    }

    let locked: boolean = true;
    tab.Collaborators.forEach((user) => {
      if (user.userId == userId) {
        locked = false;
      }
    });

    if (locked) {
      res.json({
        status: "Tab is personal",
        data: {
          tab,
        },
      });
      return;
    }

    res.json({
      status: "success",
      data: {
        tab,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllTabs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabs = await prisma.tabs.findMany({
      select: {
        elements: true,
        owner: {
          select: {
            userId: true,
            username: true,
            hexCode: true,
          },
        },
        tabId: true,
        tabName: true,
        isPrivate: true,
        Collaborators: {
          select: {
            userId: true,
            username: true,
            hexCode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let joinedTab: typeof tabs = [];

    tabs.forEach((tab) => {
      const isOwner = tab.owner.userId == userId;

      const isMember = tab.Collaborators.some((user) => user.userId == userId);
      if (isOwner || isMember) {
        joinedTab.push(tab);
      }
    });

    res.json({
      status: "success",
      data: {
        tabs: joinedTab,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};
export const getAllTabsName = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tabs = await prisma.tabs.findMany({
      select: {
        tabId: true,
        tabName: true,
        isPrivate: true,
        userId: true,
        Collaborators: {
          select: {
            userId: true,
          },
        },
      },
    });

    let joinedTab: typeof tabs = [];

    tabs.forEach((tab) => {
      const isOwner = tab.userId == userId;
      const isMember = tab.Collaborators.some((user) => user.userId == userId);
      if (isOwner || isMember) {
        joinedTab.push(tab);
      }
    });

    res.json({
      status: "success",
      data: {
        tabs: joinedTab,
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
    const tab = await prisma.tabs.create({ data: { userId } });
    res.json({
      status: "success",
      tab,
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

    const accessCode = Math.random().toString(36).substring(2, 8);
    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

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
      include: {
        Collaborators: true,
      },
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

    if (userId == tab.userId) {
      locked = false;
    }

    if (locked) {
      res.json({
        status: "Tab is personal",
        data: {
          tab,
          locked,
        },
      });
      return;
    }

    res.json({
      status: "success",
      data: {
        tab,
        locked,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const joinTab = async (req: Request, res: Response) => {
  const { accessCode } = req.params;
  const userId = req.userId;
  const tabs = await prisma.tabs.findMany({
    where: {
      accessCode,
      accessCodeExpiration: {
        gt: new Date(Date.now()),
      },
    },
    include: {
      Collaborators: {
        select: {
          userId: true,
          hexCode: true,
          username: true,
        },
      },
    },
  });

  if (tabs.length == 0) {
    res.json({
      message: "Invalid Access Code",
    });
    return;
  }
  if (tabs.length > 1) {
    res.json({
      message: "Access Code Conflict, Ask them to generate a new code",
    });
    return;
  }

  const tab = tabs[0];

  let alreadyJoined = tab.Collaborators.some((user) => user.userId === userId);

  alreadyJoined = alreadyJoined || tab.userId == userId;

  if (alreadyJoined) {
    res.json({
      message: "Already part of this tab",
    });
    return;
  }
  const tabDets = await prisma.tabs.update({
    where: {
      tabId: tab.tabId,
    },
    data: {
      Collaborators: {
        connect: {
          userId,
        },
      },
    },
    include: {
      Collaborators: {
        select: {
          userId: true,
          hexCode: true,
          username: true,
          isOnline: true,
        },
      },
    },
  });

  res.json({
    message: "Room joined",
    tabDets,
  });
  return;
};

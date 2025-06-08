import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";
import { Prisma } from "@prisma/client";

export const getAllTabs = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const prisma = getPrisma(c);
    const tabSelect = {
      tabId: true,
      tabName: true,
      elements: true,
      isEditable: true,
      isPrivate: true,
      accessCode: true,
      owner: {
        select: {
          userId: true,
          username: true,
          hexCode: true,
        },
      },
      Collaborators: {
        select: {
          userId: true,
          username: true,
          hexCode: true,
        },
      },
    } as const;

    type TabWithRelations = Prisma.TabsGetPayload<{
      select: typeof tabSelect;
      isOwner: boolean;
      isMember: boolean;
    }>;

    let tabs: TabWithRelations[] = await prisma.tabs.findMany({
      select: tabSelect,
    });

    const tabsWithRoles = tabs
      .map((tab) => {
        const isOwner = tab.owner.userId === userId;
        const isMember = tab.Collaborators.some(
          (user) => user.userId === userId
        );
        if (isOwner || isMember)
          return {
            ...tab,
            role: isOwner ? "owner" : "member",
          };
      })
      .filter((tab) => tab);

    return c.json({
      status: "success",
      data: {
        tabs: tabsWithRoles,
      },
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const getAllTabsName = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const prisma = getPrisma(c);
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

    return c.json({
      status: "success",
      data: {
        tabs: joinedTab,
      },
    });
  } catch (error) {
    c.status(500);
    return c.json({ status: "error", message: "An unexpected error occurred" });
  }
};
export const createTab = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const prisma = getPrisma(c);
    const tab = await prisma.tabs.create({ data: { userId } });
    return c.json({
      status: "success",
      tab,
    });
  } catch (error) {
    c.status(500);
    return c.json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const removeTab = async (c: Context) => {
  try {
    const tabId = c.req.param().tabId;
    const userId = c.req.userId;
    const prisma = getPrisma(c);
    const tab = await prisma.tabs.findUnique({ where: { tabId } });

    if (!tab || tab.userId !== userId) {
      c.status(403);
      return c.json({ status: "error", message: "Unauthorized" });
    }
    await prisma.tabs.delete({ where: { tabId } });
    return c.json({
      status: "success",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const changeTabName = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const tabId = c.req.param().tabId;
    const { tabName } = await c.req.json();
    const prisma = getPrisma(c);
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        tabName: tabName as string,
      },
    });
    if (updatedTab.count === 0) {
      c.status(404);
      return c.json({ status: "error", message: "Tab not found" });
    }

    return c.json({
      status: "success",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const changeTabEditMode = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const tabId = c.req.param().tabId;
    const { isEditable } = await c.req.json();
    const prisma = getPrisma(c);
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        isEditable: Boolean(isEditable),
      },
    });
    if (updatedTab.count === 0) {
      c.status(404);
      return c.json({ status: "error", message: "Tab not found" });
    }
    return c.json({
      status: "success",
    });
  } catch (error) {
    c.status(500);
    return c.json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const changeTabVisibility = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const tabId = c.req.param().tabId;
    const { isPrivate } = await c.req.json();
    const prisma = getPrisma(c);
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        isPrivate: Boolean(isPrivate),
      },
    });
    if (updatedTab.count === 0) {
      c.status(404);
      return c.json({ status: "error", message: "Tab not found" });
    }

    return c.json({
      status: "success",
    });
  } catch (error) {
    c.status(500);
    return c.json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const generateAccessCode = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const tabId = c.req.param().tabId;

    const accessCode = Math.random().toString(36).substring(2, 8);
    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    const prisma = getPrisma(c);
    const updatedTab = await prisma.tabs.updateMany({
      where: { tabId, userId },
      data: {
        accessCode,
        accessCodeExpiration: expirationTime,
      },
    });

    if (updatedTab.count === 0) {
      c.status(404);
      return c.json({ status: "error", message: "Tab not found" });
    }
    return c.json({
      status: "success",
      data: {
        accessCode,
        expiresAt: expirationTime,
      },
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const getTabDetail = async (c: Context) => {
  try {
    const userId = c.req.userId;
    const { tabId } = c.req.param();
    const prisma = getPrisma(c);
    const tab = await prisma.tabs.findUnique({
      where: { tabId },
      include: {
        Collaborators: true,
      },
    });
    if (!tab) {
      c.status(404);
      return c.json({ message: "Tab not found" });
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
      return c.json({
        status: "Tab is personal",
        data: {
          tab,
          locked,
        },
      });
    }

    return c.json({
      status: "success",
      data: {
        tab,
        locked,
      },
    });
  } catch (error) {
    c.status(500);
    return c.json({ status: "error", message: "An unexpected error occurred" });
  }
};

export const joinTab = async (c: Context) => {
  const { accessCode } = c.req.param();
  const userId = c.req.userId;
  const prisma = getPrisma(c);
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
    return c.json({
      message: "Invalid Access Code",
    });
  }
  if (tabs.length > 1) {
    return c.json({
      message: "Access Code Conflict, Ask them to generate a new code",
    });
  }

  const tab = tabs[0];

  let alreadyJoined = tab.Collaborators.some((user) => user.userId === userId);

  alreadyJoined = alreadyJoined || tab.userId == userId;

  if (alreadyJoined) {
    return c.json({
      message: "Already part of this tab",
    });
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

  return c.json({
    message: "Room joined",
    tabDets,
  });
};

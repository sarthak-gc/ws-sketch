import { getPrisma } from "../utils/getPrisma";
export const getAllTabs = async (c) => {
    console.log("here");
    try {
        const userId = c.req.userId;
        const prisma = getPrisma(c);
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
        return c.json({
            status: "success",
            data: {
                tabs,
            },
        });
    }
    catch (error) {
        console.log("error here");
        c.status(500);
        return c.json({
            status: "error",
            message: "An unexpected error occurred LOL",
        });
    }
};
export const createTab = async (c) => {
    try {
        const userId = c.req.userId;
        const prisma = getPrisma(c);
        const tab = await prisma.tabs.create({ data: { userId } });
        return c.json({
            status: "success",
            tab,
        });
    }
    catch (error) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};
export const removeTab = async (c) => {
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
    }
    catch (error) {
        c.status(500);
        return c.json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};
export const changeTabName = async (c) => {
    try {
        const userId = c.req.userId;
        const tabId = c.req.param().tabId;
        const { tabName } = await c.req.json();
        const prisma = getPrisma(c);
        const updatedTab = await prisma.tabs.updateMany({
            where: { tabId, userId },
            data: {
                tabName: tabName,
            },
        });
        if (updatedTab.count === 0) {
            c.status(404);
            return c.json({ status: "error", message: "Tab not found" });
        }
        return c.json({
            status: "success",
        });
    }
    catch (error) {
        c.status(500);
        return c.json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};
export const changeTabEditMode = async (c) => {
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
    }
    catch (error) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};
export const changeTabVisibility = async (c) => {
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
    }
    catch (error) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};
export const generateAccessCode = async (c) => {
    try {
        const userId = c.req.userId;
        const tabId = c.req.param().tabId;
        const { duration } = await c.req.json();
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
    }
    catch (error) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};
export const getTabDetail = async (c) => {
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
        let locked = true;
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
                },
            });
        }
        return c.json({
            status: "success",
            data: {
                tab,
            },
        });
    }
    catch (error) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};
export const joinTab = async (c) => {
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

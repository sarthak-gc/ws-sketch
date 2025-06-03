import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import { getPrisma } from "../utils/getPrisma";
export const authMiddleware = async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) {
        c.status(403);
        return c.json({
            status: "error",
            message: "Authorization failed, login to continue",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
        const prisma = getPrisma(c);
        const user = await prisma.user.findFirst({
            where: {
                userId: decoded.userId,
            },
        });
        if (!user) {
            c.status(403);
            return c.json({
                status: "error",
                message: "User not found, Try logging in again",
            });
        }
        c.req.userId = decoded.userId;
        return await next();
    }
    catch (err) {
        c.status(500);
        return c.json({ status: "error", message: "An unexpected error occurred" });
    }
};

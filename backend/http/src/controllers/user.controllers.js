import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateColor } from "../utils/hexcode";
import { setCookie } from "hono/cookie";
import { getPrisma } from "../utils/getPrisma";
export const register = async (c) => {
    try {
        const { username, password, email } = await c.req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const prisma = getPrisma(c);
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }],
            },
        });
        if (userExists) {
            c.status(500);
            return c.json({
                status: "error",
                message: "User with that username or email already exists, try different username or email",
            });
        }
        const hexCode = generateColor(username);
        const user = await prisma.user.create({
            data: {
                hexCode,
                username: username,
                password: hashedPassword,
                email: email,
            },
        });
        const token = jwt.sign({ username, userId: user.userId }, process.env.JWT_SECRET || "SECRET");
        setCookie(c, "token", token, {
            httpOnly: true,
        });
        return c.json({
            message: "User created successfully",
            userId: user.userId,
            username,
        });
    }
    catch (error) {
        c.status(500);
        return c.json({ message: "Error creating user" });
    }
};
export const login = async (c) => {
    try {
        const { username, password } = await c.req.json();
        const prisma = getPrisma(c);
        const user = await prisma.user.findUnique({
            where: { username: username },
        });
        if (!user) {
            c.status(404);
            return c.json({ message: "User not found" });
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username, userId: user.userId }, process.env.JWT_SECRET || "SECRET");
            setCookie(c, "token", token, {
                httpOnly: true,
            });
            return c.json({ username, userId: user.userId });
        }
        c.status(401);
        return c.json({ message: "Invalid password" });
    }
    catch (error) {
        c.status(500);
        return c.json({ message: "Error logging in" });
    }
};
export const logout = async (c) => {
    try {
        setCookie(c, "token", "");
        return c.json({ message: "User logged out successfully" });
    }
    catch (error) {
        c.status(500);
        return c.json({ message: "Error logging out" });
    }
};

import { Hono } from "hono";
import { login, logout, register } from "../controllers/user.controllers";
const userRoutes = new Hono();
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
export default userRoutes;

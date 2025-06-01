import express from "express";
import { login, logout, register } from "../controllers/user.controllers";
const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);

userRoutes.post("/logout", logout);

export default userRoutes;

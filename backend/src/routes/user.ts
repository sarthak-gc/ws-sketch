import express from "express";
const userRoutes = express.Router();

userRoutes.post("/register");
userRoutes.post("/login");

userRoutes.post("/logout");

export default userRoutes;

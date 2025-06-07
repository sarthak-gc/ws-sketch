import express from "express";
import {
  login,
  logout,
  register,
  // seedUser,
} from "../controllers/user.controllers";
import { loginLimiter } from "../middlewares/rate-limitter/loginLimiter";
const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", loginLimiter, login);

userRoutes.post("/logout", logout);

// userRoutes.post("/seed", seedUser);
export default userRoutes;

import express from "express";
import {
  login,
  logout,
  register,
  // seedUser,
} from "../controllers/user.controllers";
const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);

userRoutes.post("/logout", logout);

// userRoutes.post("/seed", seedUser);
export default userRoutes;

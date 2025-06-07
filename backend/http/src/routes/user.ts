import { Hono } from "hono";
import {
  login,
  logout,
  register,
  // seedUser,
} from "../controllers/user.controllers";
import { loginLimiter } from "../middlewares/rate-limitter/loginLimiter";
const userRoutes = new Hono();

userRoutes.post("/register", register);
userRoutes.post("/login", loginLimiter, login);

userRoutes.post("/logout", logout);
// userRoutes.post("/seed", seedUser);
export default userRoutes;

import express from "express";
import userRoutes from "./user";
import tabRoutes from "./draw";

const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/tab", tabRoutes);
export default routes;

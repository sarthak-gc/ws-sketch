import userRoutes from "./user";
import tabRoutes from "./tab";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/user", userRoutes);
routes.route("/tab", tabRoutes);
export default routes;

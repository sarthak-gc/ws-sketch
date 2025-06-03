import { Hono } from "hono";
import routes from "./routes";
import { cors } from "hono/cors";

const app = new Hono();
const frontendUrl = "https://ws-sketch.vercel.app";

app.use(
  cors({
    origin: frontendUrl || "http://localhost:5173",
    credentials: true,
  })
);

app.route("/", routes);
export default app;

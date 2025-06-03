import { Hono } from "hono";
import routes from "./routes";
import { cors } from "hono/cors";

const app = new Hono();
const origin = ["https://ws-sketch.vercel.app", "http://localhost:5173"];

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.route("/", routes);
export default app;

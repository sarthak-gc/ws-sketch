import express from "express";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/", routes);
const port = process.env.PORT || 3000;
app.listen(port);

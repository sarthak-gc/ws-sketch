import express from "express";
import { addElement, removeElement } from "../controllers/element.controllers";
const elementRoutes = express.Router();

elementRoutes.post("/element", addElement);
elementRoutes.put("/element", removeElement);

export default elementRoutes;

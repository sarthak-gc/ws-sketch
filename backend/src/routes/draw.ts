import express from "express";
const tabRoutes = express.Router();

tabRoutes.get("/tabs");
tabRoutes.get("/tab-details/:tabId");

export default tabRoutes;

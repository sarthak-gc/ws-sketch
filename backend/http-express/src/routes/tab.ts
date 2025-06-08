import express from "express";
import {
  changeTabEditMode,
  changeTabName,
  changeTabVisibility,
  createTab,
  generateAccessCode,
  getAllTabs,
  getTabDetail,
  joinTab,
  removeTab,
  getAllTabsName,
} from "../controllers/tab.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { joinLimiter } from "../middlewares/rate-limitter/joinLimiter";
const tabRoutes = express.Router();

tabRoutes.use(authMiddleware);
tabRoutes.get("/all", getAllTabs);
tabRoutes.get("/all/name", getAllTabsName);
tabRoutes.post("/create", createTab);
tabRoutes.post("/join/:accessCode", joinLimiter, joinTab);
tabRoutes.post("/:tabId/remove", removeTab);
tabRoutes.put("/:tabId/name", changeTabName);
tabRoutes.put("/:tabId/visibility", changeTabVisibility);
tabRoutes.post("/:tabId/accessCode", generateAccessCode);
tabRoutes.post("/:tabId/editable", changeTabEditMode);

tabRoutes.get("/:tabId/detail", getTabDetail);

export default tabRoutes;

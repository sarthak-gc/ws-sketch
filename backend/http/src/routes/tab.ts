import express from "express";
import {
  changeTabEditMode,
  changeTabName,
  changeTabVisibility,
  createTab,
  generateAccessCode,
  getAllTabs,
  getTabDetail,
  removeTab,
} from "../controllers/tab.controllers";
const tabRoutes = express.Router();

tabRoutes.get("/all", getAllTabs);
tabRoutes.post("/create", createTab);
tabRoutes.post("/:tabId/remove", removeTab);
tabRoutes.put("/:tabId/name", changeTabName);
tabRoutes.put("/:tabId/visibility", changeTabVisibility);
tabRoutes.post("/:tabId/accessCode", generateAccessCode);
tabRoutes.post("/:tabId/editable", changeTabEditMode);

tabRoutes.get("/:tabId/detail", getTabDetail);

export default tabRoutes;

import { Router } from "express";
import * as menu from "../controllers/menuController.js";
import middlewares from "../middlewares/index.js";

const router = Router();

// menu routes
router.post(
  "/menu",
  middlewares.upload,
  middlewares.checkDuplicate("menu", "nama"),
  menu.createMenu
);
router.get("/menu", menu.getMenus);
router.get("/menu/:id", menu.getMenuById);
router.put("/menu/:id", middlewares.upload, menu.updateMenu);
router.delete("/menu/:id", menu.deleteMenu);

export default router;

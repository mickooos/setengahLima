import { Router } from "express";
import * as kat from "../controllers/kategoriController.js";
import middlewares from "../middlewares/index.js";

const router = Router();

// kategori-menu routes
router.post(
  "/kategori-menu",
  middlewares.checkDuplicate("kategoriMenu", "nama"),
  kat.createCategory
);
router.get("/kategori-menu", kat.getCategories);
router.get("/kategori-menu/:id", kat.getCategoryById);
router.put("/kategori-menu/:id", kat.updateCategory);
router.delete("/kategori-menu/:id", kat.deleteCategory);

export default router;

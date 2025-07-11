import { Router } from "express";
import * as meja from "../controllers/mejaController.js";
import middlewares from "../middlewares/index.js";

const router = Router();

// meja routes
router.post(
  "/meja",
  middlewares.checkDuplicate("meja", "nomorMeja"),
  meja.createTable
);
router.get("/meja", meja.getTables);
router.get("/meja/:id", meja.getTableById);
router.put("/meja/:id", meja.updateTable);
router.put("/meja/status/:id", meja.updateTableStatus);
router.delete("/meja/:id", meja.deleteTable);

export default router;

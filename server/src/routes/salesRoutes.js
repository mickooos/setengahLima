import { Router } from "express";
import * as sales from "../controllers/salesController.js";

const router = Router();

// sales routes
router.get("/sales", sales.getSales);
router.get("/sales/today", sales.getSalesToday);
router.get("/sales/period", sales.getSalesByDayWeekMonthYear);

export default router;

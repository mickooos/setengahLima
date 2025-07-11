import { Router } from "express";
import * as revenue from "../controllers/revenueController.js";

const router = Router();

// revenue routes
router.post("/revenue", revenue.addRevenue);
router.get("/revenue", revenue.getAllRevenue);
router.get("/revenue/total", revenue.getTotalRevenue);
router.get("/revenue/today", revenue.getRevenueToday);
router.get("/revenue/period", revenue.getRevenueByDayWeekMonthYear);

export default router;

import { Router } from "express";
import * as order from "../controllers/pesananController.js";

const router = Router();

// order routes
router.post("/order", order.createOrder);
router.get("/order", order.getAllOrders);
router.get("/order/active-order", order.getActiveOrders);
router.get("/order/:id", order.getOrderById);
router.put("/order/:id", order.updateOrder);
router.post("/order/send-receipt", order.sendOrderReceipt);
router.post("/order/update-payment", order.updateOrderPayment);
router.delete("/order/:id", order.deleteOrder);

export default router;

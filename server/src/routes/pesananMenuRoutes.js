import { Router } from "express";
import * as items from "../controllers/pesananMenuController.js";

const router = Router();

// order items routes
router.post("/order-items", items.createOrderItem);
router.get("/order-items", items.getAllOrderItems);
router.get("/order-items/:id", items.getOrderItemById);
router.put("/order-items/:id", items.updateOrderItem);
router.delete("/order/:orderId/order-items/:itemId", items.deleteOrderItem);
router.get("/order-items/order/:id", items.getOrderItemByOrderId);

export default router;

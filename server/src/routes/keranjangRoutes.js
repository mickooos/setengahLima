import { Router } from "express";
import * as cart from "../controllers/keranjangController.js";

const router = Router();

// cart item routes
router.post("/cart", cart.createCartItem);
router.get("/cart", cart.getAllCartItem);
router.get("/cart/:id", cart.getCartItemById);
router.put("/cart/:id", cart.updateCartItem);
router.delete("/cart/:id", cart.deleteCartItem);
router.delete("/cart", cart.deleteAllItems);

export default router;

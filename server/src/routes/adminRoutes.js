import { Router } from "express";
import * as admin from "../controllers/adminController.js";
import { refreshToken } from "../controllers/tokenController.js";
import middlewares from "../middlewares/index.js";

const router = Router();
// admin routes
router.post("/admin/signin", admin.adminLogin);
router.post(
  "/admin/signup",
  middlewares.checkDuplicate("admin", "email"),
  admin.adminRegister
);
router.get("/admin/refreshToken", refreshToken);
router.get("/admin/profile", middlewares.adminOnly, admin.adminProfile);
router.delete("/admin/signout", admin.adminLogout);

export default router;

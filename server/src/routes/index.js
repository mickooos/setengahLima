import { Router } from "express";
import menuRoutes from "./menuRoutes.js";
import kategoriRoutes from "./kategoriRoutes.js";
import pesananRoutes from "./pesananRoutes.js";
import pesananMenuRoutes from "./pesananMenuRoutes.js";
import keranjangRoutes from "./keranjangRoutes.js";
import mejaRoutes from "./mejaRoutes.js";
import reservasiRoutes from "./reservasiRoutes.js";
import revenueRoutes from "./revenueRoutes.js";
import salesRoutes from "./salesRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use("/api/v1", menuRoutes);
router.use("/api/v1", kategoriRoutes);
router.use("/api/v1", pesananRoutes);
router.use("/api/v1", pesananMenuRoutes);
router.use("/api/v1", keranjangRoutes);
router.use("/api/v1", mejaRoutes);
router.use("/api/v1", reservasiRoutes);
router.use("/api/v1", revenueRoutes);
router.use("/api/v1", salesRoutes);
router.use("/api/v1", adminRoutes);

export default router;

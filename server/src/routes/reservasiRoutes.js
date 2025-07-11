import { Router } from "express";
import * as reservasi from "../controllers/reservasiController.js";
import middlewares from "../middlewares/index.js";

const router = Router();

// reservasi routes
router.post(
  "/reservation",
  middlewares.checkDuplicate("reservasi", "nama"),
  reservasi.createReservation
);
router.get("/reservation", reservasi.getReservations);
router.get("/reservation/:id", reservasi.getReservationById);
router.put("/reservation/:id", reservasi.updateReservation);
router.delete("/reservation/:id", reservasi.deleteReservation);

export default router;

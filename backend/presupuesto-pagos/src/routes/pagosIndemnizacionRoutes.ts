import { Router } from "express";
import pagosIndemnizacionController from "../controllers/pagosIndemnizacionController";
const router = Router();

router.get("/", pagosIndemnizacionController.getIndemnizaciones);
router.patch("/:id", pagosIndemnizacionController.updateEstadoAPagado);
export default router;
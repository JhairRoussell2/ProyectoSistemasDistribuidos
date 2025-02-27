// routes/generarReporteRoutes.ts
import { Router } from "express";
import GenerarReporteController from "../controllers/GenerarReporteController";

const router = Router();

// Ruta para obtener la lista completa de reportes (todos los datos)
router.get("/", GenerarReporteController.getReportesCompleto);

// Ruta para obtener el detalle completo de un siniestro por su ID
router.get("/:id", GenerarReporteController.getReporteDetalle);

export default router;

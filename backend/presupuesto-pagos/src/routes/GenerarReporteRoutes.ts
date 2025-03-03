// routes/generarReporteRoutes.ts
import { Router } from "express";
import GenerarReporteController from "../controllers/GenerarReporteController";

const router = Router();

// ===============================
// Rutas para el Dashboard
// ===============================

// Tarjeta KPI: Resumen general (total de siniestros, suma total y promedio de presupuestos)
router.get("/dashboard/resumen", GenerarReporteController.getDashboardResumen);

// 1. Tendencia mensual de siniestros
router.get("/dashboard/siniestros/tendencia", GenerarReporteController.getSiniestrosTendencia);

// 2. Distribución de presupuestos por estado (cantidad y monto total)
router.get("/dashboard/presupuestos/estados", GenerarReporteController.getPresupuestosEstados);

// 3. Desglose por taller: número de siniestros y monto total
router.get("/dashboard/talleres", GenerarReporteController.getTalleresDesglose);

// 4. Distribución de siniestros por tipo
router.get("/dashboard/siniestros/tipo", GenerarReporteController.getSiniestrosPorTipo);

// 5. Distribución de siniestros por distrito
router.get("/dashboard/siniestros/distrito", GenerarReporteController.getSiniestrosPorDistrito);

// 6. Tendencia mensual de presupuestos (suma y promedio)
router.get("/dashboard/presupuestos/tendencia", GenerarReporteController.getPresupuestosTendencia);

// ===============================
// Ruta para generar un reporte en PDF (según análisis seleccionado)
// ===============================
router.get("/pdf", GenerarReporteController.generatePdf);

export default router;

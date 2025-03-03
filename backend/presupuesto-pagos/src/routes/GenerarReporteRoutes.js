"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/generarReporteRoutes.ts
const express_1 = require("express");
const GenerarReporteController_1 = __importDefault(require("../controllers/GenerarReporteController"));
const router = (0, express_1.Router)();
// ===============================
// Rutas para el Dashboard
// ===============================
// Tarjeta KPI: Resumen general (total de siniestros, suma total y promedio de presupuestos)
router.get("/dashboard/resumen", GenerarReporteController_1.default.getDashboardResumen);
// 1. Tendencia mensual de siniestros
router.get("/dashboard/siniestros/tendencia", GenerarReporteController_1.default.getSiniestrosTendencia);
// 2. Distribución de presupuestos por estado (cantidad y monto total)
router.get("/dashboard/presupuestos/estados", GenerarReporteController_1.default.getPresupuestosEstados);
// 3. Desglose por taller: número de siniestros y monto total
router.get("/dashboard/talleres", GenerarReporteController_1.default.getTalleresDesglose);
// 4. Distribución de siniestros por tipo
router.get("/dashboard/siniestros/tipo", GenerarReporteController_1.default.getSiniestrosPorTipo);
// 5. Distribución de siniestros por distrito
router.get("/dashboard/siniestros/distrito", GenerarReporteController_1.default.getSiniestrosPorDistrito);
// 6. Tendencia mensual de presupuestos (suma y promedio)
router.get("/dashboard/presupuestos/tendencia", GenerarReporteController_1.default.getPresupuestosTendencia);
// ===============================
// Ruta para generar un reporte en PDF (según análisis seleccionado)
// ===============================
router.get("/pdf", GenerarReporteController_1.default.generatePdf);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/generarReporteRoutes.ts
const express_1 = require("express");
const GenerarReporteController_1 = __importDefault(require("../controllers/GenerarReporteController"));
const router = (0, express_1.Router)();
// Ruta para obtener la lista completa de reportes (todos los datos)
router.get("/", GenerarReporteController_1.default.getReportesCompleto);
// Ruta para obtener el detalle completo de un siniestro por su ID
router.get("/:id", GenerarReporteController_1.default.getReporteDetalle);
//Ruta para generar un reporte en PDF
router.get("/:id/pdf", GenerarReporteController_1.default.generatePdf);
exports.default = router;

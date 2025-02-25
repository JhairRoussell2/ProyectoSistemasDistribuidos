"use strict";
// routes/seguimientoRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seguimientoController_1 = require("../controllers/seguimientoController");
const router = (0, express_1.Router)();
// 📌 **Ruta para obtener los siniestros de un beneficiario**
router.get("/siniestros/beneficiario/:usuarioid", (req, res, next) => {
    (0, seguimientoController_1.obtenerSiniestrosBeneficiario)(req, res, next);
});
// 📌 **Ruta para obtener el detalle completo de un siniestro**
router.get("/siniestro/:siniestroid", (req, res, next) => {
    (0, seguimientoController_1.obtenerDetalleSiniestroCompleto)(req, res, next);
});
exports.default = router;

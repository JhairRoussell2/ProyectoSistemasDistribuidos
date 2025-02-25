// routes/seguimientoRoutes.ts

import { Router } from "express";
import { obtenerSiniestrosBeneficiario, obtenerDetalleSiniestroCompleto } from "../controllers/seguimientoController";

const router = Router();

// 📌 **Ruta para obtener los siniestros de un beneficiario**
router.get("/siniestros/beneficiario/:usuarioid", (req, res, next) => {
  obtenerSiniestrosBeneficiario(req, res, next);
});

// 📌 **Ruta para obtener el detalle completo de un siniestro**
router.get("/siniestro/:siniestroid", (req, res, next) => {
  obtenerDetalleSiniestroCompleto(req, res, next);
});

export default router;

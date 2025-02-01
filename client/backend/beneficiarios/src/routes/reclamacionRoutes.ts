import express from "express";
import { obtenerSiniestrosBeneficiario, registrarReclamacion, subirDocumentoReclamacion } from "../controllers/reclamacionController";

const router = express.Router();

// Definir las rutas
router.get("/siniestros/:UsuarioID", obtenerSiniestrosBeneficiario);
router.post("/", registrarReclamacion);
router.post("/documento", subirDocumentoReclamacion);

export default router;

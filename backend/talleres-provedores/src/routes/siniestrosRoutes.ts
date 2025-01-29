import express from "express";
import { registrarSiniestro, listarSiniestros } from "../controllers/siniestrosController";

const router = express.Router();

// Ruta para registrar un siniestro
router.post("/", registrarSiniestro);

// Ruta para listar todos los siniestros
router.get("/", listarSiniestros);

export default router;

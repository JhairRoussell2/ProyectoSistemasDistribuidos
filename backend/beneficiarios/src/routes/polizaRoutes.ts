import express from "express";
import { createPoliza, getPolizas, getPolizaByID, getPolizasByDNI, updatePolizaEstado } from "../controllers/polizaController";

const router = express.Router();

// Ruta para crear una nueva póliza
router.post("/", createPoliza);

// Ruta para obtener todas las pólizas
router.get("/", getPolizas);

// Ruta para obtener una póliza por su ID
router.get("/poliza/:polizaID", getPolizaByID);

// Ruta para obtener las pólizas de un beneficiario por su DNI
router.get("/validar/:DNI", getPolizasByDNI);

// Ruta para actualizar el estado de una póliza
router.put("/poliza/:polizaID/estado", updatePolizaEstado);

export default router;

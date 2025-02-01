import express from "express";
import {
  createPoliza,
  getPolizas,
  getPolizaByID,
  getPolizasByDNI,
  updatePolizaEstado,
  getPolizaPorBeneficiarioID,
  obtenerPolizasPorUsuarioID // Importamos la función que maneja esta ruta
} from "../controllers/polizaController";

const router = express.Router();

// Ruta para crear una nueva póliza
router.post("/", createPoliza);

// Ruta para obtener todas las pólizas
router.get("/", getPolizas);

// Ruta para obtener una póliza por su ID
router.get("/poliza/:polizaID", getPolizaByID);

// Ruta para obtener las pólizas de un beneficiario por su DNI
router.get("/validar/:DNI", getPolizasByDNI);

// Ruta para obtener el PolizaID de un BeneficiarioID
router.get("/beneficiario/:BeneficiarioID", getPolizaPorBeneficiarioID); // Nueva ruta

// Ruta para obtener las pólizas de un usuario por su ID
router.get("/usuario/:usuarioID", obtenerPolizasPorUsuarioID); // Nueva ruta

// Ruta para actualizar el estado de una póliza
router.put("/:polizaID/estado", updatePolizaEstado);

export default router;

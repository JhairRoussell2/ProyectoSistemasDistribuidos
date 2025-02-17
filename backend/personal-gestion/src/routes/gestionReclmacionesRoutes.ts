import express from "express";
import GestionReclamacionesController from "../controllers/GestionReclamacionesController";

const router = express.Router();

// Ruta para obtener todas las reclamaciones con su estado
router.get("/", GestionReclamacionesController.obtenerTodasLasReclamaciones);

// Ruta para actualizar el estado de una reclamación
router.put("/:reclamacionid/estado", GestionReclamacionesController.actualizarEstadoReclamacion);

// Ruta para obtener detalles de una reclamación específica
router.get("/:reclamacionid/detalles", GestionReclamacionesController.obtenerDetallesReclamacion);

// Ruta para eliminar una reclamación
router.delete("/:reclamacionid", GestionReclamacionesController.eliminarReclamacion);
// Ruta para validar documentos
router.post("/:reclamacionid/validar-documentos", GestionReclamacionesController.validarDocumentos);



export default router;

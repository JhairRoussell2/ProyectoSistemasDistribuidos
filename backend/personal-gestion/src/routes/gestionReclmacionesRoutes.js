"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GestionReclamacionesController_1 = __importDefault(require("../controllers/GestionReclamacionesController"));
const router = express_1.default.Router();
// Ruta para obtener todas las reclamaciones con su estado
router.get("/", GestionReclamacionesController_1.default.obtenerTodasLasReclamaciones);
// Ruta para actualizar el estado de una reclamación
router.put("/:reclamacionid/estado", GestionReclamacionesController_1.default.actualizarEstadoReclamacion);
// Ruta para obtener detalles de una reclamación específica
router.get("/:reclamacionid/detalles", GestionReclamacionesController_1.default.obtenerDetallesReclamacion);
// Ruta para eliminar una reclamación
router.delete("/:reclamacionid", GestionReclamacionesController_1.default.eliminarReclamacion);
// Ruta para validar documentos
router.put("/:reclamacionid/validarDocumentos", GestionReclamacionesController_1.default.validarDocumentos);
exports.default = router;

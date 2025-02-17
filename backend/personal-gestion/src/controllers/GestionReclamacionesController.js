"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
class GestionReclamacionesController {
    // Obtener todas las reclamaciones con su estado
    obtenerTodasLasReclamaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         GROUP BY r.reclamacionid`);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "No se encontraron reclamaciones." });
                }
                else {
                    res.json(result.rows);
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener las reclamaciones", error });
            }
        });
    }
    // Obtener detalles de una reclamación específica
    obtenerDetallesReclamacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reclamacionid } = req.params;
            try {
                const result = yield db_1.default.query(`SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         WHERE r.reclamacionid = $1
         GROUP BY r.reclamacionid`, [reclamacionid]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Reclamación no encontrada" });
                }
                else {
                    res.json(result.rows[0]);
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener detalles de la reclamación", error });
            }
        });
    }
    // Actualizar el estado de una reclamación
    actualizarEstadoReclamacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reclamacionid } = req.params;
            const { estado } = req.body; // Ya no incluimos "notas"
            try {
                const estadosValidos = ['Pendiente', 'En Proceso', 'Resuelta', 'Rechazada'];
                if (!estadosValidos.includes(estado)) {
                    res.status(400).json({ message: "Estado inválido." });
                    return;
                }
                // Actualizar solo el estado de la reclamación
                yield db_1.default.query(`UPDATE reclamacion 
       SET estado = $1 
       WHERE reclamacionid = $2`, [estado, reclamacionid]);
                res.json({ message: "Estado de la reclamación actualizado con éxito." });
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar el estado de la reclamación", error });
            }
        });
    }
    // Eliminar una reclamación
    eliminarReclamacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reclamacionid } = req.params;
            try {
                const { rowCount } = yield db_1.default.query("SELECT * FROM reclamacion WHERE reclamacionid = $1", [reclamacionid]);
                if (rowCount === 0) {
                    res.status(404).json({ message: "Reclamación no encontrada." });
                    return;
                }
                // Eliminar los documentos relacionados
                yield db_1.default.query("DELETE FROM documentosreclamacion WHERE reclamacionid = $1", [reclamacionid]);
                // Eliminar la reclamación
                yield db_1.default.query("DELETE FROM reclamacion WHERE reclamacionid = $1", [reclamacionid]);
                res.json({ message: "Reclamación eliminada con éxito." });
            }
            catch (error) {
                res.status(500).json({ message: "Error al eliminar la reclamación", error });
            }
        });
    }
    // Backend: Validación de Documentos
    validarDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reclamacionid } = req.params;
            try {
                // Consulta los documentos relacionados con la reclamación
                const result = yield db_1.default.query(`SELECT d.documentoid, d.nombre, d.extension, d.url, d.estado_documento
         FROM documentosreclamacion d
         WHERE d.reclamacionid = $1`, [reclamacionid]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "No se encontraron documentos para esta reclamación." });
                    return;
                }
                // Filtrar los documentos válidos (ejemplo: solo archivos PDF y PNG)
                const documentosValidos = result.rows.filter((doc) => {
                    return doc.extension === 'pdf' || doc.extension === 'png';
                });
                if (documentosValidos.length === 0) {
                    res.status(400).json({ message: "Ningún documento válido encontrado." });
                    return;
                }
                // Extrae los IDs de los documentos válidos
                const documentosIds = documentosValidos.map((doc) => doc.documentoid);
                // Actualiza el estado de los documentos a 'Validado'
                yield db_1.default.query(`UPDATE documentosreclamacion 
         SET estado_documento = 'Validado' 
         WHERE reclamacionid = $1 AND documentoId = ANY($2::int[])`, [reclamacionid, documentosIds]);
                res.json({ message: "Documentos validados con éxito." });
            }
            catch (error) {
                res.status(500).json({ message: "Error al validar los documentos", error });
            }
        });
    }
}
exports.default = new GestionReclamacionesController();

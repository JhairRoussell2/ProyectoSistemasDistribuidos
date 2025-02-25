"use strict";
// controllers/seguimientoController.ts
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
exports.obtenerReclamacionesPorUsuario = exports.obtenerDetalleSiniestroCompleto = exports.obtenerSiniestrosBeneficiario = void 0;
const db_1 = __importDefault(require("../config/db"));
// 📌 **Obtener siniestros de un beneficiario**
const obtenerSiniestrosBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuarioid } = req.params;
        console.log('UsuarioID recibido:', usuarioid); // Log para verificar el usuarioid
        if (!usuarioid) {
            return res.status(400).json({ message: "UsuarioID es requerido." });
        }
        const { rows: beneficiarioRows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioid]);
        console.log('Beneficiario encontrado:', beneficiarioRows); // Log para verificar el beneficiario encontrado
        if (beneficiarioRows.length === 0) {
            return res.status(404).json({ message: "Beneficiario no encontrado." });
        }
        const beneficiarioid = beneficiarioRows[0].beneficiarioid;
        const { rows: siniestros } = yield db_1.default.query("SELECT * FROM siniestros WHERE beneficiarioid = $1", [beneficiarioid]);
        console.log('Siniestros encontrados para el beneficiario:', siniestros); // Log para verificar los siniestros encontrados
        if (siniestros.length === 0) {
            return res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
        }
        return res.status(200).json(siniestros);
    }
    catch (error) {
        console.error("❌ Error al obtener siniestros del beneficiario:", error);
        next(error);
        return res.status(500).json({ message: "Error al obtener los siniestros." });
    }
});
exports.obtenerSiniestrosBeneficiario = obtenerSiniestrosBeneficiario;
// 📌 **Obtener detalle completo del siniestro**
// 📌 **Obtener detalle completo del siniestro**
const obtenerDetalleSiniestroCompleto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { siniestroid } = req.params;
        console.log('SiniestroID recibido:', siniestroid); // Log para verificar el siniestroid recibido
        if (!siniestroid) {
            return res.status(400).json({ message: "SiniestroID es requerido." });
        }
        const { rows: siniestroRows } = yield db_1.default.query("SELECT * FROM siniestros WHERE siniestroid = $1", [siniestroid]);
        console.log('Datos del siniestro encontrado:', siniestroRows); // Log para verificar los datos del siniestro
        if (siniestroRows.length === 0) {
            return res.status(404).json({ message: "Siniestro no encontrado." });
        }
        const siniestro = siniestroRows[0];
        const { rows: reclamaciones } = yield db_1.default.query(`SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         WHERE r.siniestroid = $1
         GROUP BY r.reclamacionid`, [siniestroid]);
        console.log('Reclamaciones asociadas al siniestro:', reclamaciones); // Log para verificar las reclamaciones obtenidas
        const { rows: presupuestos } = yield db_1.default.query("SELECT * FROM presupuesto WHERE siniestroid = $1", [siniestroid]);
        console.log('Presupuestos asociados al siniestro:', presupuestos); // Log para verificar los presupuestos obtenidos
        // Ajuste en la consulta: Cambiar el nombre de la columna para asegurar que sea correcta
        console.log('Siniestro ID:', siniestroid);
        console.log('Taller ID en siniestros:', siniestroRows[0].tallerid);
        const { rows: talleres } = yield db_1.default.query(`SELECT t.nombre AS nombre_taller, t.direccion, t.telefono
         FROM taller t
         JOIN siniestros s ON s.tallerid = t.tallerid
         WHERE s.siniestroid = $1`, // Asegúrate de usar el nombre correcto de la columna
        [siniestroid]);
        console.log('Talleres asociados al siniestro:', talleres); // Log para verificar los talleres obtenidos
        const { rows: documentos } = yield db_1.default.query(`SELECT dr.*, r.siniestroid
       FROM documentosreclamacion dr
       LEFT JOIN reclamacion r ON r.reclamacionid = dr.reclamacionid
       WHERE r.siniestroid = $1`, [siniestroid]);
        console.log('Documentos asociados al siniestro:', documentos); // Log para verificar los documentos obtenidos
        return res.status(200).json({
            siniestro,
            reclamaciones,
            presupuestos,
            talleres,
            documentos,
        });
    }
    catch (error) {
        console.error("Error al obtener detalles del siniestro:", error);
        return res.status(500).json({ message: "Error al obtener los detalles del siniestro" });
    }
});
exports.obtenerDetalleSiniestroCompleto = obtenerDetalleSiniestroCompleto;
const obtenerReclamacionesPorUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuarioid } = req.params;
        if (!usuarioid) {
            res.status(400).json({ message: "UsuarioID es requerido." });
            return;
        }
        // 🔹 **Obtener el beneficiario asociado al usuario**
        const { rows: beneficiarioRows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioid]);
        if (beneficiarioRows.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        const beneficiarioid = beneficiarioRows[0].beneficiarioid;
        // 🔹 **Obtener las reclamaciones asociadas al beneficiario**
        const { rows: reclamaciones } = yield db_1.default.query(`SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         WHERE r.siniestroid IN (SELECT siniestroid FROM siniestros WHERE beneficiarioid = $1)
         GROUP BY r.reclamacionid`, [beneficiarioid]);
        if (reclamaciones.length === 0) {
            res.status(404).json({ message: "No se encontraron reclamaciones para este usuario." });
            return;
        }
        res.status(200).json(reclamaciones);
    }
    catch (error) {
        console.error("Error al obtener reclamaciones:", error);
        next(error);
    }
});
exports.obtenerReclamacionesPorUsuario = obtenerReclamacionesPorUsuario;

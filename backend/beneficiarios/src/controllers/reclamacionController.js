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
exports.subirDocumentoReclamacion = exports.registrarReclamacion = exports.obtenerSiniestrosBeneficiario = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
const multer_1 = __importDefault(require("multer"));
// Configurar multer para manejar la carga de archivos
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).array("documentos", 5);
// **📌 Esquema de Validación con Joi**
const schema = joi_1.default.object({
    UsuarioID: joi_1.default.number().required(), // Se espera que el frontend envíe el UsuarioID
    SiniestroID: joi_1.default.number().required(),
    estado: joi_1.default.string().max(50).required(),
    descripcion: joi_1.default.string().required(),
    tipo: joi_1.default.string().max(50).required(),
    documentos: joi_1.default.array().items(joi_1.default.string().uri()).optional(), // Lista de URLs de documentos
});
// **1️⃣ Obtener los siniestros asociados al beneficiario autenticado**
const obtenerSiniestrosBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioID = req.body.UsuarioID || req.params.UsuarioID; // Se recibe UsuarioID en la petición
        if (!usuarioID) {
            res.status(400).json({ message: "UsuarioID es requerido." });
            return;
        }
        // 🔹 Buscar el BeneficiarioID a partir del UsuarioID
        const [beneficiario] = yield db_1.default.query("SELECT BeneficiarioID FROM beneficiario WHERE UsuarioID = ?", [usuarioID]);
        if (beneficiario.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        const beneficiarioID = beneficiario[0].BeneficiarioID;
        // 🔹 Obtener los siniestros asociados al beneficiario
        const [siniestros] = yield db_1.default.query("SELECT * FROM siniestros WHERE BeneficiarioID = ?", [beneficiarioID]);
        if (siniestros.length === 0) {
            res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
            return;
        }
        res.status(200).json(siniestros);
    }
    catch (error) {
        console.error("Error al obtener siniestros:", error);
        next(error);
    }
});
exports.obtenerSiniestrosBeneficiario = obtenerSiniestrosBeneficiario;
const registrarReclamacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Datos recibidos en POST /api/reclamaciones:", req.body); // ✅ Agregar este log
        // **Validar los datos con Joi**
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { UsuarioID, SiniestroID, estado, descripcion, tipo } = req.body;
        const [result] = yield db_1.default.query(`INSERT INTO Reclamacion (SiniestroID, estado, descripcion, tipo) VALUES (?, ?, ?, ?)`, [SiniestroID, estado, descripcion, tipo]);
        res.status(201).json({
            message: "Reclamación registrada con éxito",
            ReclamacionID: result.insertId,
        });
    }
    catch (error) {
        console.error("Error al registrar reclamación:", error);
        next(error);
    }
});
exports.registrarReclamacion = registrarReclamacion;
// **3️⃣ Subir documentos de reclamación**
const subirDocumentoReclamacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ReclamacionID } = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: "No se han subido archivos" });
            return;
        }
        const documentosInsert = files.map(file => [ReclamacionID, file.originalname, file.mimetype, file.path]);
        yield db_1.default.query(`INSERT INTO DocumentosReclamacion (ReclamacionID, Nombre, Extension, Url) VALUES ?`, [documentosInsert]);
        res.status(201).json({ message: "Documentos subidos con éxito" });
    }
    catch (error) {
        console.error("Error al subir documentos:", error);
        next(error);
    }
});
exports.subirDocumentoReclamacion = subirDocumentoReclamacion;

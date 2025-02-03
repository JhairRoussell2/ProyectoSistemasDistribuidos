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
exports.obtenerSiniestrosBeneficiario = exports.obtenerReclamacionesPorUsuario = exports.registrarReclamacion = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
// 📌 **Configurar Cloudinary**
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
// 📌 **Configurar Multer para manejar archivos en memoria**
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).array("documentos", 5); // Se permite un máximo de 5 archivos
// 📌 **Esquema de Validación con Joi**
const schema = joi_1.default.object({
    siniestroid: joi_1.default.number().required(),
    estado: joi_1.default.string().max(50).required(),
    descripcion: joi_1.default.string().required(),
    tipo: joi_1.default.string().max(50).required(),
});
// 📌 **Registrar una nueva reclamación con documentos**
const registrarReclamacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: "Error al procesar archivos con Multer." });
        }
        const client = yield db_1.default.connect(); // 📌 Iniciar una transacción
        try {
            console.log("📌 Recibiendo datos:", req.body);
            // **Validar los datos con Joi**
            const { error } = schema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const { siniestroid, estado, descripcion, tipo } = req.body;
            // 🔹 **Verificar si el siniestro existe**
            const { rowCount: siniestroExists } = yield db_1.default.query("SELECT * FROM siniestros WHERE siniestroid = $1", [siniestroid]);
            if (siniestroExists === 0) {
                res.status(404).json({ message: "Siniestro no encontrado." });
                return;
            }
            // 📌 **Iniciar la transacción**
            yield client.query("BEGIN");
            // 🔹 **Insertar la reclamación**
            const { rows: reclamacionRows } = yield client.query(`INSERT INTO reclamacion (siniestroid, estado, descripcion, tipo) VALUES ($1, $2, $3, $4) RETURNING reclamacionid`, [siniestroid, estado, descripcion, tipo]);
            const reclamacionid = reclamacionRows[0].reclamacionid;
            console.log("📌 Reclamación creada con ID:", reclamacionid);
            if (!req.files || req.files.length === 0) {
                yield client.query("ROLLBACK");
                res.status(400).json({ message: "Debe subir al menos un documento." });
                return;
            }
            let documentosInsert = [];
            // 📌 **Subir archivos a Cloudinary y registrar en la BD**
            for (const file of req.files) {
                const result = yield new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: "Reclamaciones" }, (error, result) => {
                        if (error)
                            reject(error);
                        resolve(result);
                    });
                    stream.end(file.buffer);
                });
                if (!result) {
                    yield client.query("ROLLBACK");
                    return res.status(500).json({ message: "Error al subir documentos a Cloudinary" });
                }
                const extension = file.originalname.split(".").pop() || "desconocido";
                documentosInsert.push([reclamacionid, file.originalname, extension, result.secure_url]);
                // 📌 **Insertar documentos en la base de datos**
                yield client.query(`INSERT INTO documentosreclamacion (reclamacionid, nombre, extension, url, fecha_subida)
          VALUES ($1, $2, $3, $4, NOW())`, [reclamacionid, file.originalname, extension, result.secure_url]);
            }
            yield client.query("COMMIT"); // 📌 **Confirmar transacción**
            res.status(201).json({ message: "Reclamación y documentos subidos con éxito.", reclamacionid });
        }
        catch (error) {
            yield client.query("ROLLBACK"); // 📌 **Revertir en caso de error**
            console.error("❌ Error al registrar reclamación con documentos:", error);
            next(error);
        }
        finally {
            client.release();
        }
    }));
});
exports.registrarReclamacion = registrarReclamacion;
// 📌 **Obtener las reclamaciones de un usuario**
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
// 📌 **Obtener siniestros de un beneficiario**
const obtenerSiniestrosBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Parámetros recibidos:", req.params); // ✅ Imprimir los parámetros recibidos
        const { usuarioid } = req.params;
        if (!usuarioid) {
            res.status(400).json({ message: "UsuarioID es requerido." });
            return;
        }
        // 🔹 Buscar el BeneficiarioID desde el usuarioID
        const { rows: beneficiarioRows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioid]);
        if (beneficiarioRows.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        const beneficiarioid = beneficiarioRows[0].beneficiarioid;
        // 🔹 Obtener los siniestros del beneficiario
        const { rows: siniestros } = yield db_1.default.query("SELECT * FROM siniestros WHERE beneficiarioid = $1", [beneficiarioid]);
        if (siniestros.length === 0) {
            res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
            return;
        }
        res.status(200).json(siniestros);
    }
    catch (error) {
        console.error("❌ Error al obtener siniestros del beneficiario:", error);
        next(error);
    }
});
exports.obtenerSiniestrosBeneficiario = obtenerSiniestrosBeneficiario;

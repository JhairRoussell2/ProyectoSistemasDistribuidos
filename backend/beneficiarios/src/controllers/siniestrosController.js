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
exports.listarSiniestros = exports.registrarSiniestro = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
// Esquema de validación
const schema = joi_1.default.object({
    tipoSiniestro: joi_1.default.string().required(),
    fechaSiniestro: joi_1.default.date().required(),
    departamento: joi_1.default.string().required(),
    distrito: joi_1.default.string().required(),
    provincia: joi_1.default.string().required(),
    ubicacion: joi_1.default.string().required(),
    descripcion: joi_1.default.string().required(),
    documentos: joi_1.default.array().items(joi_1.default.string().uri()).optional(), // Asegúrate de permitir un array de URLs
    usuarioID: joi_1.default.number().required(), // Para obtener el BeneficiarioID relacionado
});
// Controlador para registrar un siniestro
const registrarSiniestro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Solicitud recibida:', req.body);
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos = [], usuarioID, } = req.body;
        console.log({
            tipoSiniestro,
            fechaSiniestro,
            departamento,
            distrito,
            provincia,
            ubicacion,
            descripcion,
            documentos,
            usuarioID,
        });
        // Obtener BeneficiarioID y PolizaID desde usuarioID
        const { rows: beneficiarioRows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioID]);
        if (beneficiarioRows.length === 0) {
            res.status(404).json({ error: "Beneficiario no encontrado." });
            return;
        }
        const BeneficiarioID = beneficiarioRows[0].beneficiarioid;
        console.log("BeneficiarioID:", BeneficiarioID);
        const { rows: polizaRows } = yield db_1.default.query("SELECT polizaid FROM poliza WHERE beneficiarioid = $1", [BeneficiarioID]);
        if (polizaRows.length === 0) {
            res.status(404).json({ error: "Póliza no encontrada." });
            return;
        }
        const PolizaID = polizaRows[0].polizaid;
        // Verificar si los documentos están en el formato correcto (si existen)
        let documentosUrls = [];
        if (documentos.length > 0) {
            for (let i = 0; i < documentos.length; i++) {
                const isValidUrl = joi_1.default.string().uri().validate(documentos[i]);
                if (isValidUrl.error) {
                    res.status(400).json({ error: `El documento en la posición ${i + 1} no es una URL válida` });
                    return;
                }
                documentosUrls.push(documentos[i]);
            }
        }
        // Convertir los documentos a JSON válido
        const documentosJson = JSON.stringify(documentosUrls);
        // Llamada a la consulta INSERT directamente en la tabla 'siniestros' con RETURNING
        const result = yield db_1.default.query(`INSERT INTO siniestros 
      (beneficiarioid, polizaid, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING siniestroid`, // Usar RETURNING para obtener el siniestroid
        [
            BeneficiarioID, // BeneficiarioID obtenido
            PolizaID, // PolizaID obtenido
            tipoSiniestro, // Tipo de Siniestro
            fechaSiniestro, // Fecha del Siniestro
            departamento, // Departamento
            distrito, // Distrito
            provincia, // Provincia
            ubicacion, // Ubicación
            descripcion, // Descripción
            documentosJson, // Documentos en formato JSON
        ]);
        // Verificar que la consulta INSERT devolvió el siniestroid
        const siniestroId = result.rows[0].siniestroid;
        if (!siniestroId) {
            res.status(500).json({ error: "No se pudo obtener el ID del siniestro." });
            return;
        }
        // Responder con el ID del siniestro insertado
        res.status(201).json({
            message: "Siniestro registrado con éxito",
            siniestroId, // Retorna el ID del siniestro recién creado
        });
    }
    catch (error) {
        console.error("Error al registrar siniestro:", error);
        next(error);
    }
});
exports.registrarSiniestro = registrarSiniestro;
const listarSiniestros = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.default.query("SELECT * FROM siniestros");
        // Si no hay resultados
        if (result.length === 0) {
            res.status(404).json({ message: "No se encontraron siniestros." });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error al listar siniestros:", error);
        next(error);
    }
});
exports.listarSiniestros = listarSiniestros;

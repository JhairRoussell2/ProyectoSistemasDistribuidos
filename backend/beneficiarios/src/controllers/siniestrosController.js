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
const multer_1 = __importDefault(require("multer")); // Asegúrate de tener multer instalado
// Configurar multer para manejar la carga de archivos
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).array("documentos", 5); // Ajusta el número máximo de archivos según lo necesites
// Esquema de validación
const schema = joi_1.default.object({
    BeneficiarioID: joi_1.default.number().required(), // Asegúrate de permitir este campo
    PolizaID: joi_1.default.number().required(),
    tipoSiniestro: joi_1.default.string().required(),
    fechaSiniestro: joi_1.default.date().required(),
    departamento: joi_1.default.string().required(),
    distrito: joi_1.default.string().required(),
    provincia: joi_1.default.string().required(),
    ubicacion: joi_1.default.string().required(),
    descripcion: joi_1.default.string().required(),
    documentos: joi_1.default.array().items(joi_1.default.string().uri()).optional(), // Asegúrate de permitir un array de URLs
});
// Controlador para registrar un siniestro
const registrarSiniestro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Solicitud recibida:', req.body); // Imprimir el cuerpo de la solicitud
        // Validar los datos enviados
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos = [], BeneficiarioID, PolizaID, } = req.body;
        console.log({
            tipoSiniestro,
            fechaSiniestro,
            departamento,
            distrito,
            provincia,
            ubicacion,
            descripcion,
            documentos,
            BeneficiarioID,
            PolizaID,
        });
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
        // Llamada a la consulta INSERT directamente en la tabla 'siniestros'
        const [result] = yield db_1.default.query(`INSERT INTO siniestros 
      (beneficiarioid, polizaid, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            BeneficiarioID, // BeneficiarioID
            PolizaID, // PolizaID
            tipoSiniestro, // Tipo de Siniestro
            fechaSiniestro, // Fecha del Siniestro
            departamento, // Departamento
            distrito, // Distrito
            provincia, // Provincia
            ubicacion, // Ubicación
            descripcion, // Descripción
            documentosJson, // Documentos en formato JSON
        ]);
        // Responder con el ID del siniestro insertado
        res.status(201).json({
            message: "Siniestro registrado con éxito",
            siniestroId: result.insertId, // Retorna el ID del siniestro recién creado
        });
    }
    catch (error) {
        console.error("Error al registrar siniestro:", error);
        next(error);
    }
});
exports.registrarSiniestro = registrarSiniestro;
// Controlador para listar todos los siniestros
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

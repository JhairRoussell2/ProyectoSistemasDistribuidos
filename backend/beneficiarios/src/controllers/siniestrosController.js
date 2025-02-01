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
const siniestroService_1 = __importDefault(require("../services/siniestroService"));
// Esquema de validación para el cuerpo de la solicitud
const schema = joi_1.default.object({
    tipoSiniestro: joi_1.default.string().required(),
    fechaSiniestro: joi_1.default.date().required(),
    departamento: joi_1.default.string().required(),
    distrito: joi_1.default.string().required(),
    provincia: joi_1.default.string().required(),
    ubicacion: joi_1.default.string().required(),
    descripcion: joi_1.default.string().required(),
    documentos: joi_1.default.array().items(joi_1.default.string().uri()).optional(),
    usuarioID: joi_1.default.number().required(),
});
const registrarSiniestro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validar la solicitud
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos = [], usuarioID, } = req.body;
        // Obtener BeneficiarioID y PolizaID desde usuarioID
        const beneficiarioID = yield siniestroService_1.default.obtenerBeneficiarioID(usuarioID);
        const polizaID = yield siniestroService_1.default.obtenerPolizaID(beneficiarioID);
        // Verificar y procesar los documentos
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
        const documentosJson = JSON.stringify(documentosUrls);
        // Registrar el siniestro
        const siniestroId = yield siniestroService_1.default.registrarSiniestro(beneficiarioID, polizaID, tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentosJson);
        // Responder con el ID del siniestro registrado
        res.status(201).json({ message: "Siniestro registrado con éxito", siniestroId });
    }
    catch (error) {
        console.error("Error al registrar siniestro:", error);
        next(error);
    }
});
exports.registrarSiniestro = registrarSiniestro;
const listarSiniestros = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const siniestros = yield siniestroService_1.default.listarSiniestros();
        if (siniestros.length === 0) {
            res.status(404).json({ message: "No se encontraron siniestros." });
            return;
        }
        res.status(200).json(siniestros);
    }
    catch (error) {
        console.error("Error al listar siniestros:", error);
        next(error);
    }
});
exports.listarSiniestros = listarSiniestros;

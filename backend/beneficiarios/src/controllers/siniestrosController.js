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
    tipoSiniestro: joi_1.default.string().max(50).required(),
    fechaSiniestro: joi_1.default.date().required(),
    departamento: joi_1.default.string().max(100).required(),
    distrito: joi_1.default.string().max(100).required(),
    provincia: joi_1.default.string().max(100).required(),
    ubicacion: joi_1.default.string().max(255).required(),
    descripcion: joi_1.default.string().required(),
    documentos: joi_1.default.array().items(joi_1.default.string().uri()).optional(),
});
// Controlador para registrar un siniestro
const registrarSiniestro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validar los datos enviados
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos = [], } = req.body;
        // Insertar en la base de datos
        const [result] = yield db_1.default.query(`INSERT INTO siniestros 
      (tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            tipoSiniestro,
            fechaSiniestro,
            departamento,
            distrito,
            provincia,
            ubicacion,
            descripcion,
            JSON.stringify(documentos),
        ]);
        res.status(201).json({
            message: "Siniestro registrado con éxito",
            siniestroId: result.insertId,
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

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
exports.updateBeneficiario = exports.deleteBeneficiario = exports.createBeneficiario = exports.getBeneficiarios = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
// Esquema de validación
const schema = joi_1.default.object({
    Nombre: joi_1.default.string().max(100).required(),
    Apellido: joi_1.default.string().max(100).required(),
    DNI: joi_1.default.string().length(8).required(),
    Email: joi_1.default.string().email().required(),
    Telefono: joi_1.default.string().max(15).required(),
});
// Controlador para obtener beneficiarios
const getBeneficiarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Intentando conectar con la base de datos...");
        const [result] = yield db_1.default.query("SELECT * FROM beneficiario");
        console.log("Datos obtenidos de la base de datos:", result);
        if (!result || result.length === 0) {
            console.log("No se encontraron beneficiarios.");
            res.status(404).json({ message: "No se encontraron beneficiarios." });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error en getBeneficiarios:", error);
        res.status(500).json({ error: "Error al obtener beneficiarios" });
    }
});
exports.getBeneficiarios = getBeneficiarios;
// Controlador para crear un beneficiario
const createBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Solicitud recibida para crear beneficiario:", req.body);
        const { error } = schema.validate(req.body);
        if (error) {
            console.error("Error de validación:", error.details[0].message);
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { Nombre, Apellido, DNI, Email, Telefono } = req.body;
        const [existing] = yield db_1.default.query("SELECT * FROM beneficiario WHERE DNI = ? OR Email = ?", [DNI, Email]);
        if (existing.length > 0) {
            res.status(400).json({ error: "El DNI o Email ya están registrados." });
            return;
        }
        const [result] = yield db_1.default.query("INSERT INTO beneficiario (Nombre, Apellido, DNI, Email, Telefono) VALUES (?, ?, ?, ?, ?)", [Nombre, Apellido, DNI, Email, Telefono]);
        console.log("Beneficiario creado con ID:", result.insertId);
        res.status(201).json({
            message: "Beneficiario creado exitosamente",
            beneficiarioId: result.insertId,
        });
    }
    catch (error) {
        console.error("Error al crear beneficiario:", error);
        next(error);
    }
});
exports.createBeneficiario = createBeneficiario;
// Controlador para eliminar un beneficiario
const deleteBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.query("DELETE FROM beneficiario WHERE BeneficiarioID = ?", [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({ message: "Beneficiario eliminado exitosamente" });
    }
    catch (error) {
        console.error("Error al eliminar beneficiario:", error);
        next(error);
    }
});
exports.deleteBeneficiario = deleteBeneficiario;
// Controlador para actualizar un beneficiario
const updateBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { Nombre, Apellido, DNI, Email, Telefono } = req.body;
        const [result] = yield db_1.default.query("UPDATE beneficiario SET Nombre = ?, Apellido = ?, DNI = ?, Email = ?, Telefono = ? WHERE BeneficiarioID = ?", [Nombre, Apellido, DNI, Email, Telefono, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({ message: "Beneficiario actualizado exitosamente" });
    }
    catch (error) {
        console.error("Error al actualizar beneficiario:", error);
        next(error);
    }
});
exports.updateBeneficiario = updateBeneficiario;

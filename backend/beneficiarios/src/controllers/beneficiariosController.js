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
exports.checkIfNewBeneficiario = exports.updateBeneficiario = exports.deleteBeneficiario = exports.createBeneficiario = exports.getBeneficiarioPorID = exports.getBeneficiarios = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Esquema de validación
const schema = joi_1.default.object({
    Nombre: joi_1.default.string().max(100).required(),
    Apellido: joi_1.default.string().max(100).required(),
    DNI: joi_1.default.string().length(8).required(),
    Email: joi_1.default.string().email().required(),
    Telefono: joi_1.default.string().max(15).required(),
    Password: joi_1.default.string().min(6).required(),
    ConfirmPassword: joi_1.default.ref("Password"),
});
// Controlador para obtener beneficiarios
const getBeneficiarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Intentando conectar con la base de datos...");
        const [result] = yield db_1.default.query("CALL GetBeneficiarios()");
        console.log("Datos obtenidos de la base de datos:", result);
        if (!result) {
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
const getBeneficiarioPorID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Llamada al procedimiento almacenado para obtener el beneficiario
        const [result] = yield db_1.default.query("CALL GetBeneficiarioPorID(?)", [id]);
        if (!result) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({
            message: "Beneficiario encontrado"
        }); // Devuelve el primer beneficiario encontrado
    }
    catch (error) {
        console.error("Error al obtener beneficiario por ID:", error);
        next(error);
    }
});
exports.getBeneficiarioPorID = getBeneficiarioPorID;
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
        const { Nombre, Apellido, DNI, Email, Telefono, Password, ConfirmPassword } = req.body;
        // Verifica que las contraseñas coincidan
        if (Password !== ConfirmPassword) {
            res.status(400).json({ error: 'Las contraseñas no coinciden' });
            return;
        }
        // Hashear la contraseña antes de guardarla
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
        // Llamada al procedimiento almacenado para crear el usuario y el beneficiario
        yield db_1.default.query("CALL sp_RegisterBeneficiario(?, ?, ?, ?, ?, ?)", [Nombre, Apellido, Email, hashedPassword, DNI, Telefono]);
        console.log("Beneficiario creado exitosamente");
        res.status(201).json({
            message: "Beneficiario creado exitosamente",
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
        // Llamada al procedimiento almacenado para eliminar el beneficiario
        const [result] = yield db_1.default.query("CALL DeleteBeneficiario(?)", [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({ message: "Beneficiario y usuario eliminados exitosamente" });
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
        const { Nombre, Apellido, DNI, Email, Telefono, Password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
        const [result] = yield db_1.default.query("CALL UpdateBeneficiario(?, ?, ?, ?, ?, ?,?)", [id, Nombre, Apellido, DNI, Email, Telefono, hashedPassword]);
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
const checkIfNewBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { BeneficiarioID } = req.params;
    try {
        // Verificar si el beneficiario tiene alguna póliza activa
        const [rows] = yield db_1.default.query("SELECT COUNT(*) as count FROM poliza WHERE BeneficiarioID = ? AND Estado = 'Activo'", [BeneficiarioID]);
        if (rows[0].count === 0) {
            // Si no tiene póliza activa, responder que es nuevo
            res.status(200).json({ isNew: true });
        }
        else {
            // Si tiene pólizas activas, responder que no es nuevo
            res.status(200).json({ isNew: false });
        }
    }
    catch (error) {
        console.error("Error al verificar beneficiario:", error);
        res.status(500).json({ error: "Error al verificar el beneficiario" });
    }
});
exports.checkIfNewBeneficiario = checkIfNewBeneficiario;

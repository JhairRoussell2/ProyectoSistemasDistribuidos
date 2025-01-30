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
exports.checkIfNewBeneficiario = exports.updateBeneficiario = exports.deleteBeneficiario = exports.getUserRole = exports.createBeneficiario = exports.login = exports.getBeneficiarioPorID = exports.getBeneficiarios = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_1 = require("../models/email");
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    try {
        // Buscar al usuario por su correo electrónico
        const user = yield (0, email_1.findUserByEmail)(Email);
        // Verificar si el usuario existe
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' }); // Usa return aquí
            return;
        }
        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = yield bcrypt_1.default.compare(Password, user.Password);
        if (!isMatch) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return; // Usa return aquí
        }
        // Generar un token JWT (si es necesario)
        // const token = generateToken({ UsuarioID: user.UsuarioID, Rol: user.Rol });
        // Responder con éxito
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                UsuarioID: user.UsuarioID,
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Email: user.Email,
                Rol: user.Rol,
            },
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
exports.login = login;
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
// Controlador para obtener el rol del usuario
const getUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UsuarioID } = req.params;
        // Consulta directa a la base de datos para obtener el rol del usuario
        const [rows] = yield db_1.default.query("SELECT Rol FROM usuario WHERE UsuarioID = ?", [UsuarioID]);
        // Verificar si el usuario existe
        if (rows.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return; // Agregar return para evitar que el código continúe ejecutándose
        }
        const user = rows[0]; // Asumiendo que rows[0] contiene el objeto del usuario
        console.log(user);
        // Enviar el rol del usuario como respuesta
        res.status(200).json({ role: user.Rol });
    }
    catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        next(error); // Pasa el error al middleware global de errores
    }
});
exports.getUserRole = getUserRole;
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
    console.log(BeneficiarioID);
    try {
        // Verificar si el beneficiario tiene alguna póliza activa
        const [rows] = yield db_1.default.query("select count(*) as count from poliza INNER JOIN beneficiario on beneficiario.BeneficiarioID = poliza.BeneficiarioID WHERE UsuarioID = ?", [BeneficiarioID]);
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

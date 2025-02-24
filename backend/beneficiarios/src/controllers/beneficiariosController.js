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
exports.verificarDNI = exports.verificarEmail = exports.getBeneficiariosPorDNI = exports.updateBeneficiario = exports.deleteBeneficiario = exports.checkIfNewBeneficiario = exports.getUserRole = exports.createBeneficiario = exports.login = exports.getBeneficiarioPorID = exports.getBeneficiarioPorUsuarioID = exports.getBeneficiarios = void 0;
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
    ConfirmPassword: joi_1.default.ref("Password")
    // Elimina la validación de UsuarioID, ya que es generado en la base de datos
});
// Controlador para obtener beneficiarios
const getBeneficiarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Intentando conectar con la base de datos...");
        const { rows } = yield db_1.default.query("SELECT * FROM beneficiario ORDER BY nombre ASC"); // Agregar ORDER BY para ordenar por beneficiarioid
        console.log("Datos obtenidos de la base de datos:", rows);
        if (rows.length === 0) {
            console.log("No se encontraron beneficiarios.");
            res.status(404).json({ message: "No se encontraron beneficiarios." });
            return;
        }
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error en getBeneficiarios:", error);
        res.status(500).json({ error: "Error al obtener beneficiarios" });
    }
});
exports.getBeneficiarios = getBeneficiarios;
const getBeneficiarioPorUsuarioID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UsuarioID } = req.params;
    try {
        const { rows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [UsuarioID]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({ BeneficiarioID: rows[0].BeneficiarioID });
    }
    catch (error) {
        console.error("Error al obtener BeneficiarioID:", error);
        res.status(500).json({ error: "Error al obtener BeneficiarioID" });
    }
});
exports.getBeneficiarioPorUsuarioID = getBeneficiarioPorUsuarioID;
const getBeneficiarioPorID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Llamada al procedimiento almacenado para obtener el beneficiario
        const { rows } = yield db_1.default.query("SELECT * FROM get_beneficiario_por_id($1)", [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({
            message: "Beneficiario encontrado",
            beneficiario: rows[0]
        });
    }
    catch (error) {
        console.error("Error al obtener beneficiario por ID:", error);
        next(error);
    }
});
exports.getBeneficiarioPorID = getBeneficiarioPorID;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    console.log('Email:', Email);
    console.log('Password:', Password);
    try {
        // Buscar al usuario por su correo electrónico
        const user = yield (0, email_1.findUserByEmail)(Email);
        console.log('Usuario encontrado:', user);
        // Verificar si el usuario existe
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        // Verificar si la contraseña proporcionada es válida
        if (!Password || !user.password) { // Asegúrate de usar `user.password` (en minúsculas)
            res.status(400).json({ error: 'Contraseña no válida' });
            return;
        }
        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = yield bcrypt_1.default.compare(Password, user.password); // Asegúrate de usar `user.password`
        if (!isMatch) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }
        // Responder con éxito
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                UsuarioID: user.usuarioid,
                Nombre: user.nombre,
                Apellido: user.apellido,
                Email: user.email,
                Rol: user.rol,
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
        const result = yield db_1.default.query("SELECT public.sp_registerbeneficiario($1, $2, $3, $4, $5, $6)", [Nombre, Apellido, Email, hashedPassword, DNI, Telefono]);
        if (result.rows[0].error) {
            const errorMessage = result.rows[0].error;
            // Si el mensaje contiene "duplicate key value", es un problema de unicidad (correo o DNI)
            if (errorMessage.includes("duplicate key value")) {
                res.status(400).json({ error: "El correo electrónico o DNI ya están registrados." });
                return;
            }
            // Si hay otro tipo de error, lo podemos manejar aquí
            res.status(500).json({ error: "Error en el servidor. Intente más tarde." });
            return;
        }
        console.log("Beneficiario creado exitosamente");
        res.status(201).json({
            message: "Beneficiario creado exitosamente",
            result: result.rows[0]
        });
    }
    catch (error) {
        console.error("Error al crear beneficiario:", error);
        if (error.message.includes('duplicate key value')) {
            res.status(400).json({ error: "El correo electrónico o DNI ya están registrados." });
        }
        else {
            res.status(500).json({ error: "Error en el servidor. Intente más tarde." });
        }
    }
});
exports.createBeneficiario = createBeneficiario;
// Controlador para obtener el rol del usuario
const getUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UsuarioID } = req.params;
        // Consulta directa a la base de datos para obtener el rol del usuario
        const { rows } = yield db_1.default.query("SELECT rol FROM usuario WHERE usuarioID = $1", [UsuarioID]);
        // Verificar si el usuario existe
        if (rows.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        const user = rows[0]; // Asumiendo que rows[0] contiene el objeto del usuario
        console.log(user.rol);
        // Enviar el rol del usuario como respuesta
        res.status(200).json({ role: user.rol });
    }
    catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        next(error);
    }
});
exports.getUserRole = getUserRole;
const checkIfNewBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { BeneficiarioID } = req.params;
    console.log(BeneficiarioID);
    try {
        // Verificar si el beneficiario tiene alguna póliza activa
        const { rows } = yield db_1.default.query(`SELECT COUNT(*) AS count
       FROM poliza
       INNER JOIN beneficiario ON beneficiario.BeneficiarioID = poliza.BeneficiarioID
       WHERE beneficiario.UsuarioID = $1`, [BeneficiarioID]);
        // Comprobar si el conteo es 0, indicando que no tiene pólizas activas
        if (parseInt(rows[0].count, 10) === 0) {
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
// Controlador para eliminar un beneficiario
const deleteBeneficiario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Eliminar las pólizas asociadas al beneficiario
        yield db_1.default.query("DELETE FROM poliza WHERE beneficiarioid = $1", [id]);
        // Eliminar los registros de siniestros que hacen referencia al BeneficiarioID
        yield db_1.default.query("DELETE FROM siniestros WHERE beneficiarioid = $1", [id]);
        // Eliminar el beneficiario
        const { rowCount } = yield db_1.default.query("DELETE FROM beneficiario WHERE beneficiarioid = $1", [id]);
        if (rowCount === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json({ message: "Beneficiario y sus registros asociados eliminados exitosamente." });
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
        console.log(id);
        // Validar los datos de entrada con el esquema
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { nombre, apellido, dni, email, telefono, password, usuarioid } = req.body;
        console.log("Datos a actualizar:", req.body);
        // Hashear la contraseña antes de guardarla
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const id_beneficiario = parseInt(id, 10);
        // Realizar la actualización directamente en la tabla beneficiario
        const { rowCount } = yield db_1.default.query(`UPDATE beneficiario
       SET nombre = $1, apellido = $2, dni = $3, email = $4, telefono = $5
       WHERE beneficiarioid= $6`, [nombre, apellido, dni, email, telefono, id_beneficiario]);
        // Si se proporcionó una nueva contraseña, actualizarla en la tabla Usuario
        if (password) {
            yield db_1.default.query(`UPDATE usuario
         SET password = $1
         WHERE usuarioid = (SELECT usuarioid FROM beneficiario WHERE beneficiarioid = $2)`, [hashedPassword, id_beneficiario]);
        }
        // Verificar si la fila fue afectada (actualizada)
        if (rowCount === 0) {
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
const getBeneficiariosPorDNI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { DNI } = req.params;
    try {
        const { rows } = yield db_1.default.query(`SELECT * FROM beneficiario WHERE dni = $1`, // Consulta para obtener el beneficiario por DNI
        [DNI]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Beneficiario no encontrado." });
            return;
        }
        res.status(200).json(rows); // Devolver los beneficiarios encontrados
    }
    catch (error) {
        console.error("Error al obtener beneficiarios por DNI:", error);
        res.status(500).json({ error: "Error al obtener beneficiarios por DNI" });
    }
});
exports.getBeneficiariosPorDNI = getBeneficiariosPorDNI;
const verificarEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const { rows } = yield db_1.default.query("SELECT email FROM usuario WHERE email = $1", [email]);
        if (rows.length > 0) {
            res.status(200).json({ exists: true });
        }
        else {
            res.status(200).json({ exists: false });
        }
    }
    catch (error) {
        console.error("Error al verificar email:", error);
        res.status(500).json({ error: "Error al verificar email" });
    }
});
exports.verificarEmail = verificarEmail;
const verificarDNI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dni } = req.params;
    try {
        const { rows } = yield db_1.default.query("SELECT dni FROM beneficiario WHERE dni = $1", [dni]);
        if (rows.length > 0) {
            res.status(200).json({ exists: true });
        }
        else {
            res.status(200).json({ exists: false });
        }
    }
    catch (error) {
        console.error("Error al verificar DNI:", error);
        res.status(500).json({ error: "Error al verificar DNI" });
    }
});
exports.verificarDNI = verificarDNI;

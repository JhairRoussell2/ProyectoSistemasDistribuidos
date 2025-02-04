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
exports.resetPassword = exports.recuperarContraseña = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const userModel_1 = require("../models/userModel");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Registro de usuario
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Nombre, Apellido, Email, Password, Rol } = req.body;
    try {
        // Verificamos si el email ya está en uso
        const userExists = yield (0, userModel_1.findUserByEmail)(Email);
        if (userExists) {
            res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            return;
        }
        // Hasheamos la contraseña antes de guardarla
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
        // Crear el usuario en la base de datos
        yield (0, userModel_1.createUser)({ Nombre, Apellido, Email, Password: hashedPassword, Rol });
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    try {
        const user = yield (0, userModel_1.findUserByEmail)(Email);
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const isMatch = yield bcrypt_1.default.compare(Password, user.Password);
        if (!isMatch) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }
        // Generar token JWT para la sesión del usuario
        const token = (0, jwt_1.generateToken)({ UsuarioID: user.UsuarioID, Rol: user.Rol });
        // Responder con éxito y enviar el token junto con los datos del usuario
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
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
const recuperarContraseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email } = req.body;
    try {
        const user2 = yield (0, userModel_1.findUserByEmail2)(Email);
        console.log("✅ Usuario encontrado:", user2);
        if (!user2 || !user2.usuarioid) { // Cambia user.UsuarioID a user.usuarioid
            res.status(404).json({ error: "El correo no está registrado." });
            return;
        }
        const usuarioid = user2.usuarioid; // Cambia user.UsuarioID a user.usuarioid
        // 🔹 2️⃣ Generar un token único y definir su expiración (1 hora)
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        // 🔹 3️⃣ Guardar el token en la base de datos
        yield (0, userModel_1.savePasswordResetToken)(usuarioid, token, expiresAt);
        // 🔹 4️⃣ Configurar `nodemailer`
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "zavaletaryan.18@gmail.com",
                pass: "lhox fhue lgcd dxpk",
            },
        });
        // 🔹 5️⃣ Enviar el correo con el enlace de recuperación
        const resetLink = `http://localhost:5173/reset/${token}`;
        yield transporter.sendMail({
            to: Email,
            subject: "Recuperación de Contraseña - SegurosFlex",
            html: `
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace es válido por 1 hora.</p>
      `,
        });
        res.json({ message: "Correo enviado. Revisa tu bandeja de entrada." });
    }
    catch (error) {
        console.error("Error en recuperación de contraseña:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});
exports.recuperarContraseña = recuperarContraseña;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        // 1️⃣ Buscar el token en la BD
        const resetTokenData = yield (0, userModel_1.findPasswordResetToken)(token);
        if (!resetTokenData) {
            res.status(400).json({ error: "Token inválido o expirado." });
            return;
        }
        const usuarioid = resetTokenData.usuarioid;
        // 2️⃣ Actualizar la contraseña del usuario
        yield (0, userModel_1.updateUserPassword)(usuarioid, newPassword);
        // 3️⃣ Eliminar el token después de usarlo
        yield (0, userModel_1.deletePasswordResetToken)(token);
        res.json({ message: "Contraseña actualizada exitosamente." });
    }
    catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});
exports.resetPassword = resetPassword;

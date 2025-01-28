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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const userModel_1 = require("../models/userModel");
// Registro de usuario
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Nombre, Apellido, Email, Password, Rol } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
    try {
        yield (0, userModel_1.createUser)({ Nombre, Apellido, Email, Password: hashedPassword, Rol });
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});
exports.register = register;
// Inicio de sesión
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

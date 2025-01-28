"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION, 10) : '1h';
/**
 * Genera un token JWT con los datos del usuario.
 * @param payload - Datos del usuario a incluir en el token.
 * @returns Token JWT como string.
 */
const generateToken = (payload) => {
    const options = { expiresIn: JWT_EXPIRATION };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
/**
 * Verifica un token JWT y devuelve los datos decodificados si es válido.
 * @param token - Token JWT a verificar.
 * @returns Datos del usuario decodificados o lanza error si no es válido.
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Token inválido o expirado');
    }
};
exports.verifyToken = verifyToken;
/**
 * Decodifica un token JWT sin verificar su validez.
 * @param token - Token JWT a decodificar.
 * @returns Datos del usuario decodificados.
 */
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;

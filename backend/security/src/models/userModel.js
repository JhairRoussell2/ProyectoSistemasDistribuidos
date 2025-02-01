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
exports.createUser = exports.findUserByEmail = void 0;
const db_1 = __importDefault(require("../config/db"));
// Función para buscar un usuario por su correo electrónico
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield db_1.default.query('SELECT UsuarioID, Nombre, Apellido, Email, Password, Rol FROM usuario WHERE Email = $1 LIMIT 1', [email]);
        // Si no se encuentra el usuario, retornamos null
        if (rows.length === 0) {
            return null;
        }
        // Retornamos el primer resultado encontrado
        return rows[0];
    }
    catch (error) {
        console.error('Error al ejecutar findUserByEmail:', error);
        throw new Error('Error en la base de datos');
    }
});
exports.findUserByEmail = findUserByEmail;
// Función para crear un usuario
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Llamada al procedimiento almacenado para crear el usuario
        yield db_1.default.query('INSERT INTO usuario (Nombre, Apellido, Email, Password, Rol) VALUES ($1, $2, $3, $4, $5)', [user.Nombre, user.Apellido, user.Email, user.Password, user.Rol]);
    }
    catch (error) {
        console.error('Error al crear el usuario:', error);
        throw new Error('Error en la base de datos');
    }
});
exports.createUser = createUser;

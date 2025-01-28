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
// Función para llamar al procedimiento almacenado
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('CALL sp_FindUserByEmail(?)', [email]);
        // En MySQL, los procedimientos almacenados devuelven un array de arrays, por lo que accedemos a `rows[0]`
        if (rows.length > 0 && rows[0].length > 0) {
            return rows[0][0]; // Retorna el primer usuario encontrado
        }
        return null;
    }
    catch (error) {
        console.error('Error al ejecutar sp_FindUserByEmail:', error);
        throw new Error('Error en la base de datos');
    }
});
exports.findUserByEmail = findUserByEmail;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.query('CALL sp_CreateUser(?, ?, ?, ?, ?)', [user.Nombre, user.Apellido, user.Email, user.Password, user.Rol]);
    }
    catch (error) {
        console.error('Error al ejecutar sp_CreateUser:', error);
        throw new Error('Error en la base de datos');
    }
});
exports.createUser = createUser;

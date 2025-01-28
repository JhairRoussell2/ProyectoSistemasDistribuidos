"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Cargar las variables de entorno desde el archivo .env
// Configuración de conexión
const dbConfig = {
    host: process.env.DB_HOST, // Dirección del servidor MySQL
    user: process.env.DB_USER, // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    database: process.env.DB_NAME, // Nombre de la base de datos
    port: parseInt(process.env.DB_PORT || '3306', 10), // Puerto de MySQL (3306 por defecto)
};
// Crear el pool de conexiones
const pool = promise_1.default.createPool(dbConfig);
pool.getConnection()
    .then(() => console.log('Conexión exitosa a la base de datos MySQL'))
    .catch((err) => console.error('Error al conectar a la base de datos MySQL:', err));
exports.default = pool;

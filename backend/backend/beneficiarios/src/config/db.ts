import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Cargar las variables de entorno desde el archivo .env

// Configuración de conexión
const dbConfig = {
    host: process.env.DB_HOST, // Dirección del servidor MySQL
    user: process.env.DB_USER, // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    database: process.env.DB_NAME, // Nombre de la base de datos
    port: parseInt(process.env.DB_PORT || '3306', 10), // Puerto de MySQL (3306 por defecto)
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(() => console.log('Conexión exitosa a la base de datos MySQL'))
    .catch((err) => console.error('Error al conectar a la base de datos MySQL:', err));

export default pool;

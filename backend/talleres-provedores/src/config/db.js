"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg"); // Asegúrate de tener instalado pg-pool
// Cadena de conexión con SSL
const connectionString = "postgresql://seguros_user:V26AfZvS1OM4uRVh9LvQEteaW8srKwwh@dpg-cueg03t6l47c739tvcbg-a.oregon-postgres.render.com:5432/seguros?sslmode=require";
// Crear el pool de conexiones usando la cadena de conexión completa
const pool = new pg_1.Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Esto permite la conexión si el servidor tiene un certificado auto-firmado (aunque no es lo más seguro en producción)
    },
});
pool.connect()
    .then(() => {
    console.log("Conectado a la base de datos PostgreSQL");
})
    .catch((err) => {
    console.error("Error al conectar a la base de datos PostgreSQL:", err);
});
exports.default = pool;

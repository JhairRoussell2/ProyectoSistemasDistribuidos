import { Pool } from "pg"; // Asegúrate de tener instalado pg-pool

// Cadena de conexión con SSL
const connectionString = "postgresql://seguros_et85_user:NwsWdkmW9cSQLmLbTisoFihLNrTqrl3d@dpg-cv0vgf5umphs739j3r80-a.ohio-postgres.render.com/seguros_et85?sslmode=require";

// Crear el pool de conexiones usando la cadena de conexión completa
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,  // Esto permite la conexión si el servidor tiene un certificado auto-firmado (aunque no es lo más seguro en producción)
  },
});

pool.connect()
  .then(() => {
    console.log("Conectado a la base de datos PostgreSQL");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos PostgreSQL:", err);
  });

export default pool;

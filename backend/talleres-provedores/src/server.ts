import express from "express";
import cors from "cors";
import proveedoresRoutes from "./routes/proveedoresRoutes";
import pool from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para permitir JSON y CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/proveedores", proveedoresRoutes);

// ✅ Verificar conexión a MySQL antes de iniciar el servidor
const verificarConexionDB = async () => {
  try {
    console.log("🔄 Conectando a la base de datos...");
    
    // Prueba la conexión con MySQL ejecutando SHOW TABLES
    const [tables]: any = await pool.query("SHOW TABLES");
    
    console.log("✅ Conectado a la base de datos MySQL");
    console.log("📌 Tablas disponibles en la base de datos:");
    tables.forEach((table: any) => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    return false;
  }
};

// ✅ Iniciar servidor solo si la base de datos está disponible
const iniciarServidor = async () => {
  const conexionExitosa = await verificarConexionDB();
  
  if (!conexionExitosa) {
    console.error("❌ No se pudo conectar a la base de datos. Verifica tu configuración.");
    process.exit(1); // Detiene la ejecución si la DB no responde
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

// Iniciar el servidor
iniciarServidor();

export default app;

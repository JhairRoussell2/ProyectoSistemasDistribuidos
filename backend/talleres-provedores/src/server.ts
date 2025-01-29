import app from "./app";
import pool from "./config/db";

const PORT = process.env.PORT || 4003;

pool.getConnection()
  .then(async (connection) => {
    console.log("Conectado a la base de datos MySQL");

    // Consulta para obtener las tablas disponibles
    try {
      const [tables]: any = await connection.query("SHOW TABLES");
      console.log("Tablas disponibles en la base de datos:");
      tables.forEach((table: any) => {
        console.log(`- ${Object.values(table)[0]}`); // Mostrar los nombres de las tablas
      });
    } catch (error) {
      console.error("Error al obtener las tablas:", error);
    } finally {
      connection.release(); // Liberar la conexión al pool
    }

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

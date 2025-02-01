import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import siniestrosRoutes from "./routes/tallerRoutes";// para talleres proximamente 
import beneficiariosRoutes from "./routes/proveedoresRoutes";

// Configurar variables de entorno
dotenv.config();

// Crear aplicación
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use("/api/proveedores", beneficiariosRoutes);


// Imprimir rutas registradas en el servidor
console.log("Rutas registradas en el servidor:");
const getRoutes = (layer: any, basePath = "") => {
  if (layer.route) {
    // Ruta directa
    console.log(`- ${basePath}${layer.route.path}`);
  } else if (layer.name === "router" && layer.handle.stack) {
    // Subrutas dentro de un router
    layer.handle.stack.forEach((subLayer: any) => {
      getRoutes(subLayer, basePath + (layer.regexp.source.replace("\\/", "/").replace("^", "").replace("?$", "")));
    });
  }
};

app._router.stack.forEach((middleware: any) => {
  getRoutes(middleware);
});


// Middleware de manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Middleware de error global:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;



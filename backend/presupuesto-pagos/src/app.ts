import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
//import beneficiariosRoutes from "./routes/presupuestoPagosRoutes";
import presupuestoPagosRoutes from "./routes/presupuestoPagosRoutes";
import multer from "multer";

// Configurar variables de entorno
dotenv.config();



// Crear aplicación
const app = express();
// Definir los tipos de archivos permitidos (imágenes y PDF)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes y PDFs."), false); // Rechazar el archivo
  }
};
// Configurar Multer para cargar archivos
const upload = multer({
  dest: 'uploads/',  // Directorio temporal
  fileFilter: fileFilter
});

// Configurar Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
//app.use("/api/proveedores", beneficiariosRoutes);
app.use("/api/presupuesto-pagos", presupuestoPagosRoutes);

// Imprimir rutas registradas en el servidor
console.log("Rutas registradas en el servidor:");
const getRoutes = (layer: any, basePath = "") => {
  if (layer.route) {
    // Si es una ruta directa, mostrar el path
    console.log(`- ${basePath}${layer.route.path}`);
  } else if (layer.name === "router" && layer.handle.stack) {
    // Si es un router con subrutas
    layer.handle.stack.forEach((subLayer: any) => {
      let cleanedPath = layer.regexp.source
        .replace(/^\^/, "") // Eliminar el `^` del inicio
        .replace(/\\\//g, "/") // Reemplazar `\/` por `/`
        .replace(/\(\?=\/\|\$\)/, "") // Eliminar `(?=\/|$)`
        .replace(/\?\//g, "/") // Eliminar `?/` extra
        .replace(/\/\?$/, ""); // Eliminar `/?` del final

      getRoutes(subLayer, basePath + cleanedPath);
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
// ✅ Ruta para cargar imágenes a Cloudinary
app.post("/upload", upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Subir el archivo a Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "Proveedores",  // Carpeta en Cloudinary
    });

    // Enviar la URL del archivo subido a Cloudinary como respuesta
    res.status(200).json(result);  
  } catch (error) {
    res.status(400).send("Error al cargar el archivo.");
  }
});

export default app;



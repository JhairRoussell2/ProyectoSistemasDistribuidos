import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "cloudinary";
import siniestrosRoutes from "./routes/siniestrosRoutes";
import beneficiariosRoutes from "./routes/beneficiariosRoutes";
import polizasRoutes from "./routes/polizaRoutes";

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

// Rutas
app.use("/api/beneficiarios", beneficiariosRoutes);
app.use("/api/siniestros", siniestrosRoutes);
app.use("/api/polizas",polizasRoutes);

// Ruta para cargar imágenes a Cloudinary
app.post("/upload", upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Subir el archivo a Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "Siniestros"
    });

    // Enviar la URL del archivo subido a Cloudinary como respuesta
    res.status(200).json(result);  // Devolver la respuesta con la URL del archivo subido
  } catch (error) {
    // En caso de error, se maneja adecuadamente
    res.status(400).send("Error al cargar el archivo.");
  }
});

export default app;

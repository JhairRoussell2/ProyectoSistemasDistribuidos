import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "cloudinary";
import siniestrosRoutes from "./routes/siniestrosRoutes";
import beneficiariosRoutes from "./routes/beneficiariosRoutes";
import polizasRoutes from "./routes/polizaRoutes";
import reclamacionRoutes from "./routes/reclamacionRoutes"; // ✅ Agregar las rutas de reclamación
import { subirDocumentoReclamacion } from "./controllers/docReclamacionController"; // ✅ Nueva función para documentos de reclamaciones

// Configurar variables de entorno
dotenv.config();

// Crear aplicación
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Agregar Rutas de la API
app.use("/api/beneficiarios", beneficiariosRoutes);
app.use("/api/siniestros", siniestrosRoutes);
app.use("/api/polizas", polizasRoutes);
app.use("/api/reclamaciones", reclamacionRoutes);

// ✅ Ruta para cargar imágenes a Cloudinary (SOLO para siniestros)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes y PDFs."), false); // Rechazar el archivo
  }
};

const upload = multer({
  dest: "uploads/", // Directorio temporal
  fileFilter: fileFilter,
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/upload", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Subir el archivo a Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "Siniestros",
    });

    // Enviar la URL del archivo subido a Cloudinary como respuesta
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send("Error al cargar el archivo.");
  }
});


export default app;

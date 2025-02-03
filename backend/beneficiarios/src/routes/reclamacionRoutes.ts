import express from "express";
import multer from "multer";
import { 
  registrarReclamacion, 
  obtenerReclamacionesPorUsuario, 
  obtenerSiniestrosBeneficiario 
} from "../controllers/reclamacionController";


// 📌 Configurar Multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("documentos", 5); // ✅ Asegurar que el campo es "documentos"

const router = express.Router();

// 📌 Definir las rutas
router.post("/", registrarReclamacion);
router.get("/:usuarioid", obtenerReclamacionesPorUsuario);
router.get("/siniestros/:usuarioid", obtenerSiniestrosBeneficiario);
//router.post("/documento", upload, subirDocumentoReclamacion); // ✅ Agregar Multer antes del controlador

export default router;

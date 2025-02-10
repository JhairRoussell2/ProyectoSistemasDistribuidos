import express from "express";
import multer from "multer";
import { 
  registrarReclamacion, 
  obtenerReclamacionesPorUsuario, 
  obtenerSiniestrosBeneficiario 
} from "../controllers/reclamacionController";

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("documentos", 5); 

const router = express.Router();

router.post("/", registrarReclamacion);
router.get("/:usuarioid", obtenerReclamacionesPorUsuario);
router.get("/siniestros/:usuarioid", obtenerSiniestrosBeneficiario);

export default router;

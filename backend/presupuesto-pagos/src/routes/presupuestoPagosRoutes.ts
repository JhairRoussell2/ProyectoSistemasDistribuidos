import { Router } from "express";
import PresupuestoPagosController from "../controllers/presupuestoPagosController";

const router = Router();


router.get("/", PresupuestoPagosController.getPresupuestosPendientes);
router.get("/:id", PresupuestoPagosController.getPresupuestoById);
router.get("/documentos/:id", PresupuestoPagosController.getDocumentosPresupuesto);
router.get("/poliza/:id",PresupuestoPagosController.getPolizaByPresupuestoId);
router.put("/:id", PresupuestoPagosController.updatePresupuesto);
export default router;

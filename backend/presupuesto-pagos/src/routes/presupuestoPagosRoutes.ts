import { Router } from "express";
import PresupuestoPagosController from "../controllers/presupuestoPagosController";
//import ProveedoresController from "../controllers/proveedoresController";

const router = Router();


router.get("/", PresupuestoPagosController.getPresupuestosPendientes)
router.get("/:id", PresupuestoPagosController.getPresupuestoById);
router.put("/:id", PresupuestoPagosController.updatePresupuesto);
export default router;

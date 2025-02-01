import { Router } from "express";
import ProveedoresController from "../controllers/proveedoresController";

const router = Router();

router.get("/", ProveedoresController.getProveedores);
router.get("/:id", ProveedoresController.getProveedorById);
router.post("/", ProveedoresController.createProveedor);
router.put("/:id", ProveedoresController.updateProveedor);
router.delete("/:id", ProveedoresController.deleteProveedor);

export default router;

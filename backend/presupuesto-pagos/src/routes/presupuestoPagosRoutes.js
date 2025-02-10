"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presupuestoPagosController_1 = __importDefault(require("../controllers/presupuestoPagosController"));
//import ProveedoresController from "../controllers/proveedoresController";
const router = (0, express_1.Router)();
router.get("/", presupuestoPagosController_1.default.getPresupuestosPendientes);
router.get("/:id", presupuestoPagosController_1.default.getPresupuestoById);
router.put("/:id", presupuestoPagosController_1.default.updatePresupuesto);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presupuestoPagosController_1 = __importDefault(require("../controllers/presupuestoPagosController"));
const router = (0, express_1.Router)();
router.get("/", presupuestoPagosController_1.default.getPresupuestosPendientes);
router.get("/:id", presupuestoPagosController_1.default.getPresupuestoById);
router.get("/documentos/:id", presupuestoPagosController_1.default.getDocumentosPresupuesto);
router.get("/poliza/:id", presupuestoPagosController_1.default.getPolizaByPresupuestoId);
router.put("/:id", presupuestoPagosController_1.default.updatePresupuesto);
exports.default = router;

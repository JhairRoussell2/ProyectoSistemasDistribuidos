"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const polizaController_1 = require("../controllers/polizaController");
const router = express_1.default.Router();
// Ruta para crear una nueva póliza
router.post("/", polizaController_1.createPoliza);
// Ruta para obtener todas las pólizas
router.get("/", polizaController_1.getPolizas);
// Ruta para obtener una póliza por su ID
router.get("/poliza/:polizaID", polizaController_1.getPolizaByID);
// Ruta para obtener las pólizas de un beneficiario por su DNI
router.get("/validar/:DNI", polizaController_1.getPolizasByDNI);
// Ruta para actualizar el estado de una póliza
router.put("/poliza/:polizaID/estado", polizaController_1.updatePolizaEstado);
exports.default = router;

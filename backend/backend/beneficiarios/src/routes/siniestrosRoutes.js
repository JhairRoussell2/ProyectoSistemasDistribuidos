"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const siniestrosController_1 = require("../controllers/siniestrosController");
const router = express_1.default.Router();
// Ruta para registrar un siniestro
router.post("/", siniestrosController_1.registrarSiniestro);
// Ruta para listar todos los siniestros
router.get("/", siniestrosController_1.listarSiniestros);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const reclamacionController_1 = require("../controllers/reclamacionController");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).array("documentos", 5);
const router = express_1.default.Router();
router.post("/", reclamacionController_1.registrarReclamacion);
router.get("/:usuarioid", reclamacionController_1.obtenerReclamacionesPorUsuario);
router.get("/siniestros/:usuarioid", reclamacionController_1.obtenerSiniestrosBeneficiario);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pagosIndemnizacionController_1 = __importDefault(require("../controllers/pagosIndemnizacionController"));
const router = (0, express_1.Router)();
router.get("/", pagosIndemnizacionController_1.default.getIndemnizaciones);
router.patch("/:id", pagosIndemnizacionController_1.default.updateEstadoAPagado);
exports.default = router;

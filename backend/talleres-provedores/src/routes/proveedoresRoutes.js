"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedoresController_1 = __importDefault(require("../controllers/proveedoresController"));
const router = (0, express_1.Router)();
router.get("/", proveedoresController_1.default.getProveedores);
router.get("/:id", proveedoresController_1.default.getProveedorById);
router.post("/", proveedoresController_1.default.createProveedor);
router.put("/:id", proveedoresController_1.default.updateProveedor);
router.delete("/:id", proveedoresController_1.default.deleteProveedor);
exports.default = router;

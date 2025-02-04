"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/pagosRoutes.ts
const express_1 = require("express");
const pagosController_1 = __importDefault(require("../controllers/pagosController"));
const router = (0, express_1.Router)();
// Ruta para crear el Payment Intent
router.post('/create-payment-intent', pagosController_1.default.createPaymentIntent);
router.post('/confirm-payment', pagosController_1.default.confirmPayment);
exports.default = router;

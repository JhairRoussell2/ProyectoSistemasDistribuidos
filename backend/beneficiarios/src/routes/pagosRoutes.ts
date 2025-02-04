// src/routes/pagosRoutes.ts
import { Router } from 'express';
import pagosController from '../controllers/pagosController';

const router = Router();

// Ruta para crear el Payment Intent
router.post('/create-payment-intent', pagosController.createPaymentIntent);

router.post('/confirm-payment', pagosController.confirmPayment);

export default router;

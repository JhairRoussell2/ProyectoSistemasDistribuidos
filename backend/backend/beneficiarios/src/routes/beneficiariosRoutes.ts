import express from 'express';
import { getBeneficiarios, createBeneficiario } from '../controllers/beneficiariosController';

const router = express.Router();

router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);

export default router;

import express from 'express';
import { getBeneficiarios, createBeneficiario, deleteBeneficiario, updateBeneficiario } from '../controllers/beneficiariosController';

const router = express.Router();

router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);
router.put('/:id', updateBeneficiario);
router.delete('/:id', deleteBeneficiario);

export default router;

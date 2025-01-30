import express from 'express';
import { getBeneficiarios, createBeneficiario, deleteBeneficiario, updateBeneficiario,checkIfNewBeneficiario } from '../controllers/beneficiariosController';

const router = express.Router();

router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);
router.put('/:id', updateBeneficiario);
router.delete('/:id', deleteBeneficiario);

router.get("/:BeneficiarioID/check-new", checkIfNewBeneficiario);

export default router;

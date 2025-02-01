import express from 'express';
import { getUserRole,getBeneficiarios,login ,createBeneficiario, deleteBeneficiario, updateBeneficiario,checkIfNewBeneficiario } from '../controllers/beneficiariosController';

const router = express.Router();

router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);
router.post('/login', login);
router.put('/:id', updateBeneficiario);
router.delete('/:id', deleteBeneficiario);
router.get('/user/:UsuarioID/role', getUserRole);
router.get("/:BeneficiarioID/check-new", checkIfNewBeneficiario);

export default router;

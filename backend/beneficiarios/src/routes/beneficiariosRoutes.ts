import express from 'express';
import {
  getUserRole,
  getBeneficiarios,
  login,
  createBeneficiario,
  deleteBeneficiario,
  updateBeneficiario,
  checkIfNewBeneficiario,
  getBeneficiarioPorUsuarioID // Asegúrate de importar la función
} from '../controllers/beneficiariosController';

const router = express.Router();

// Rutas existentes
router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);
router.post('/login', login);
router.put('/:id', updateBeneficiario);
router.delete('/:id', deleteBeneficiario);
router.get('/user/:UsuarioID/role', getUserRole);
router.get("/:BeneficiarioID/check-new", checkIfNewBeneficiario);

// Nueva ruta para obtener el BeneficiarioID basado en UsuarioID
router.get('/user/:UsuarioID/beneficiario', getBeneficiarioPorUsuarioID);

export default router;

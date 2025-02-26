import express from 'express';
import {
  getUserRole,
  getBeneficiarios,
  login,
  createBeneficiario,
  deleteBeneficiario,
  updateBeneficiario,
  checkIfNewBeneficiario,
  checkPoliza,
  checkVehiculo,
  getBeneficiarioPorUsuarioID,
  getBeneficiariosPorDNI,// Asegúrate de importar la función
  verificarEmail,
  verificarDNI
} from '../controllers/beneficiariosController';

const router = express.Router();

// Rutas existentes
router.get('/', getBeneficiarios);
router.post('/', createBeneficiario);
router.post('/login', login);
router.put('/:id', updateBeneficiario);
router.delete('/:id', deleteBeneficiario);
router.get('/user/:UsuarioID/role', getUserRole);
router.get("/:id/check-poliza", checkPoliza);
router.get("/:id/check-vehiculo", checkVehiculo);
router.get("/:BeneficiarioID/check-new", checkIfNewBeneficiario);
// Ruta para obtener los beneficiarios por DNI
router.get("/validar/:DNI", getBeneficiariosPorDNI);
router.get('/validar/email/:email', verificarEmail);
router.get('/validar/dni/:dni', verificarDNI);


// Nueva ruta para obtener el BeneficiarioID basado en UsuarioID
router.get('/user/:UsuarioID/beneficiario', getBeneficiarioPorUsuarioID);

export default router;

import express from 'express';
import {
  getVehiculos,
  getVehiculoPorID,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '../controllers/vehiculoController';

const router = express.Router();

// Rutas para vehículos
router.get('/', getVehiculos); // Obtener todos los vehículos
router.get('/:id', getVehiculoPorID); // Obtener un vehículo por su ID
router.post('/', createVehiculo); // Registrar un nuevo vehículo
router.put('/:id', updateVehiculo); // Actualizar información de un vehículo
router.delete('/:id', deleteVehiculo); // Eliminar un vehículo

export default router;
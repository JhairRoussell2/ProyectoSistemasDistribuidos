"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehiculoController_1 = require("../controllers/vehiculoController");
const router = express_1.default.Router();
// Rutas para vehículos
router.get('/', vehiculoController_1.getVehiculos); // Obtener todos los vehículos
router.get('/:id', vehiculoController_1.getVehiculoPorID); // Obtener un vehículo por su ID
router.post('/', vehiculoController_1.createVehiculo); // Registrar un nuevo vehículo
router.put('/:id', vehiculoController_1.updateVehiculo); // Actualizar información de un vehículo
router.delete('/:id', vehiculoController_1.deleteVehiculo); // Eliminar un vehículo
exports.default = router;

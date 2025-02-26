"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehiculo = exports.updateVehiculo = exports.createVehiculo = exports.getVehiculoPorID = exports.getVehiculos = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
// Esquema de validación para los vehículos
const schema = joi_1.default.object({
    placa: joi_1.default.string().max(50).required(),
    marca: joi_1.default.string().max(50).required(),
    modelo: joi_1.default.string().max(50).required(),
    tipo: joi_1.default.string().max(50).required(),
    beneficiarioid: joi_1.default.number().integer().required(),
});
// 📌 Obtener todos los vehículos
const getVehiculos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield db_1.default.query("SELECT * FROM vehiculo ORDER BY vehiculoid ASC");
        if (rows.length === 0) {
            res.status(404).json({ message: "No se encontraron vehículos." });
            return;
        }
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error en getVehiculos:", error);
        res.status(500).json({ error: "Error al obtener vehículos" });
    }
});
exports.getVehiculos = getVehiculos;
// 📌 Obtener un vehículo por su ID
const getVehiculoPorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { rows } = yield db_1.default.query("SELECT * FROM vehiculo WHERE vehiculoid = $1", [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Vehículo no encontrado." });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error("Error en getVehiculoPorID:", error);
        res.status(500).json({ error: "Error al obtener el vehículo" });
    }
});
exports.getVehiculoPorID = getVehiculoPorID;
// 📌 Registrar un nuevo vehículo
const createVehiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Datos recibidos:", req.body); // 🔍 Agregar este log
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { placa, marca, modelo, tipo, beneficiarioid } = req.body; // ✅ Se incluye beneficiarioid
        console.log("Insertando en BD:", placa, marca, modelo, tipo, beneficiarioid); // 🔍 Log
        const { rows } = yield db_1.default.query("INSERT INTO vehiculo (placa, marca, modelo, tipo, beneficiarioid) VALUES ($1, $2, $3, $4, $5) RETURNING *", [placa, marca, modelo, tipo, beneficiarioid]);
        res.status(201).json({ message: "Vehículo registrado correctamente", vehiculo: rows[0] });
    }
    catch (error) {
        console.error("Error en createVehiculo:", error);
        res.status(500).json({ error: "Error al registrar el vehículo" });
    }
});
exports.createVehiculo = createVehiculo;
// 📌 Actualizar información de un vehículo
const updateVehiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { placa, marca, modelo, tipo, beneficiarioid } = req.body; // ✅ Se incluye beneficiarioid
        const result = yield db_1.default.query("UPDATE vehiculo SET placa = $1, marca = $2, modelo = $3, tipo = $4 WHERE vehiculoid = $5 RETURNING *", [placa, marca, modelo, tipo, id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "Vehículo no encontrado" });
            return;
        }
        res.status(200).json({ message: "Vehículo actualizado correctamente", data: result.rows[0] });
    }
    catch (error) {
        console.error("Error al actualizar el vehículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.updateVehiculo = updateVehiculo;
// 📌 Eliminar un vehículo
const deleteVehiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { rowCount } = yield db_1.default.query("DELETE FROM vehiculo WHERE vehiculoid = $1", [id]);
        if (rowCount === 0) {
            res.status(404).json({ message: "Vehículo no encontrado." });
            return;
        }
        res.status(200).json({ message: "Vehículo eliminado correctamente" });
    }
    catch (error) {
        console.error("Error en deleteVehiculo:", error);
        res.status(500).json({ error: "Error al eliminar el vehículo" });
    }
});
exports.deleteVehiculo = deleteVehiculo;

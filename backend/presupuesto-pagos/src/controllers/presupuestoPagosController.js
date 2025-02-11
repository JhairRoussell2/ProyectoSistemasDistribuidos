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
const db_1 = __importDefault(require("../config/db"));
class PresupuestoPagosController {
    // Obtener datos importantes de presupuestos pendientes
    getPresupuestosPendientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Llamada a la función 'get_presupuestos_pendientes()' que devuelve todos los datos necesarios de presupuestos pendientes
                const result = yield db_1.default.query("SELECT * FROM public.get_presupuestos_pendientes()");
                res.json(result.rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener los proveedores", error });
            }
        });
    }
    // Obtener presupuesto por ID
    getPresupuestoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Llamada a la función 'get_presupuesto_by_id' para obtener el presupuesto por su ID
                const result = yield db_1.default.query("SELECT * FROM public.get_presupuesto_by_id($1)", [id]);
                // Si no se encuentra el presupuesto
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Presupuesto no encontrado" });
                }
                else {
                    res.json(result.rows[0]);
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener el presupuesto", error });
            }
        });
    }
    // Actualizar un presupuesto
    updatePresupuesto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { montototal, costo_reparacion, costo_piezas_mano_obra, detalle_presupuesto } = req.body;
            try {
                // Llamada a la función 'update_presupuesto' para actualizar los datos del presupuesto
                yield db_1.default.query("SELECT public.update_presupuesto($1, $2, $3, $4, $5, $6, $7)", [
                    id, // ID del presupuesto a actualizar
                    montototal,
                    costo_reparacion,
                    costo_piezas_mano_obra,
                    detalle_presupuesto,
                    'Validado',
                    new Date().toISOString()
                ]);
                res.json({ message: "Presupuesto actualizado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar el presupuesto", error });
            }
        });
    }
}
exports.default = new PresupuestoPagosController();

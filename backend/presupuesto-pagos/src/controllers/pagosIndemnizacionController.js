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
class pagosIndemnizacionController {
    // Obtener datos importantes de presupuestos validados y pagados
    getIndemnizaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Llamada a la función 'get_indemnizaciones()' que devuelve todos los datos necesarios
                const result = yield db_1.default.query("SELECT * FROM public.get_indemnizaciones()");
                res.json(result.rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener las indemnizaciones", error });
            }
        });
    }
    // Actualizar estado de un presupuesto a "Pagado" si estaba en "Validado"
    updateEstadoAPagado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({ message: "Se requiere id" });
                    return;
                }
                const result = yield db_1.default.query("UPDATE presupuesto SET estado = 'Pagado' WHERE presupuestoid = $1 AND estado = 'Validado' RETURNING *", [id]);
                if (result.rowCount === 0) {
                    res.status(400).json({ message: "Presupuesto no encontrado o no está en estado 'Validado'" });
                }
                else {
                    const presupuesto = result.rows[0];
                    res.json({
                        message: `El pago de indemnización para el siniestro SIN-${presupuesto.siniestroid} por un monto de S/.${presupuesto.montototal} ha sido procesado correctamente.`,
                        data: presupuesto
                    });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar el estado", error });
            }
        });
    }
}
exports.default = new pagosIndemnizacionController();

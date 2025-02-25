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
class GenerarReporteController {
    // Devuelve la lista completa de reportes usando el filtro 'Validado'
    getReportesCompleto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT s.siniestroid, 
               s.fecha_siniestro, 
               s.tipo_siniestro, 
               s.descripcion, 
               t.nombre AS nombre_taller, 
               p.montototal, 
               p.estado
          FROM siniestros s
          JOIN presupuesto p ON s.siniestroid = p.siniestroid
          JOIN taller t ON s.tallerid = t.tallerid
         WHERE p.estado = 'Validado'
      `;
                const result = yield db_1.default.query(query);
                res.json(result.rows);
            }
            catch (error) {
                res.status(500).json({
                    message: "Error al obtener los reportes completos",
                    error,
                });
            }
        });
    }
    // Devuelve el detalle completo de un siniestro específico (por ID)
    getReporteDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const query = `
        SELECT s.siniestroid, 
               s.fecha_siniestro, 
               s.tipo_siniestro, 
               s.descripcion, 
               t.nombre AS nombre_taller, 
               p.montototal, 
               p.estado
          FROM siniestros s
          JOIN presupuesto p ON s.siniestroid = p.siniestroid
          JOIN taller t ON s.tallerid = t.tallerid
         WHERE s.siniestroid = $1
      `;
                const result = yield db_1.default.query(query, [id]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Siniestro no encontrado" });
                }
                else {
                    res.json(result.rows[0]);
                }
            }
            catch (error) {
                res.status(500).json({
                    message: "Error al obtener el reporte del siniestro",
                    error,
                });
            }
        });
    }
}
exports.default = new GenerarReporteController();

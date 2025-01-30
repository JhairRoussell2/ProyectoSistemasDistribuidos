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
class PolizaModel {
    // Crear una póliza
    createPoliza(BeneficiarioID, TipoPoliza) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Determinar la fecha de inicio (hoy)
                const FechaInicio = new Date().toISOString().split("T")[0]; // Fecha de hoy (YYYY-MM-DD)
                // Determinar la fecha de fin (plazo de 1 año)
                const fechaFin = new Date();
                fechaFin.setFullYear(fechaFin.getFullYear() + 1); // Sumar 1 año
                const FechaFin = fechaFin.toISOString().split("T")[0]; // Fecha dentro de 1 año (YYYY-MM-DD)
                // Crear la póliza en la base de datos
                const [result] = yield db_1.default.query("INSERT INTO poliza (BeneficiarioID, TipoPoliza, FechaInicio, FechaFin) VALUES (?, ?, ?, ?)", [BeneficiarioID, TipoPoliza, FechaInicio, FechaFin]);
                return result;
            }
            catch (error) {
                throw new Error(`Error al crear la póliza: ${error.message}`);
            }
        });
    }
    // Obtener todas las pólizas
    getPolizas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield db_1.default.query("SELECT * FROM poliza");
                return result;
            }
            catch (error) {
                throw new Error(`Error al obtener pólizas: ${error.message}`);
            }
        });
    }
    // Obtener pólizas de un beneficiario por su DNI
    getPolizasByDNI(DNI) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield db_1.default.query(`SELECT * FROM poliza WHERE BeneficiarioID IN (SELECT BeneficiarioID FROM beneficiario WHERE DNI = ?)`, [DNI]);
                return result;
            }
            catch (error) {
                throw new Error(`Error al obtener pólizas por DNI: ${error.message}`);
            }
        });
    }
    // Obtener una póliza específica por ID
    getPolizaByID(polizaID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield db_1.default.query("SELECT * FROM poliza WHERE PolizaID = ?", [polizaID]);
                return result;
            }
            catch (error) {
                throw new Error(`Error al obtener la póliza: ${error.message}`);
            }
        });
    }
    updatePolizaEstado(polizaID, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield db_1.default.query("UPDATE poliza SET Estado = ? WHERE PolizaID = ?", [estado, polizaID]);
                return result;
            }
            catch (error) {
                throw new Error(`Error al actualizar la póliza: ${error.message}`);
            }
        });
    }
}
exports.default = new PolizaModel();

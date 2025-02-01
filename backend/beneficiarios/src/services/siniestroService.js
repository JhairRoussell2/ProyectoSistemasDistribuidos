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
class SiniestroService {
    // Obtener BeneficiarioID desde usuarioID
    obtenerBeneficiarioID(usuarioID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield db_1.default.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioID]);
            if (rows.length === 0) {
                throw new Error("Beneficiario no encontrado");
            }
            return rows[0].beneficiarioid;
        });
    }
    // Obtener PolizaID desde BeneficiarioID
    obtenerPolizaID(beneficiarioID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield db_1.default.query("SELECT polizaid FROM poliza WHERE beneficiarioid = $1", [beneficiarioID]);
            if (rows.length === 0) {
                throw new Error("Póliza no encontrada");
            }
            return rows[0].polizaid;
        });
    }
    // Registrar el siniestro en la base de datos
    registrarSiniestro(beneficiarioID, polizaID, tipoSiniestro, fechaSiniestro, departamento, distrito, provincia, ubicacion, descripcion, documentosJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield db_1.default.query(`INSERT INTO siniestros 
      (beneficiarioid, polizaid, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING siniestroid`, [
                beneficiarioID,
                polizaID,
                tipoSiniestro,
                fechaSiniestro,
                departamento,
                distrito,
                provincia,
                ubicacion,
                descripcion,
                documentosJson,
            ]);
            return rows[0].siniestroid;
        });
    }
    // Listar todos los siniestros
    listarSiniestros() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield db_1.default.query("SELECT * FROM siniestros");
            return rows;
        });
    }
}
exports.default = new SiniestroService();

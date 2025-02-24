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
const nodemailer_1 = __importDefault(require("nodemailer"));
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
            try {
                const { rows } = yield db_1.default.query("SELECT polizaid, estado FROM poliza WHERE beneficiarioid = $1", [beneficiarioID]);
                if (rows.length === 0) {
                    throw new Error("Póliza no encontrada");
                }
                if (rows[0].estado !== "Activa") {
                    throw new Error("La póliza no ha sido activada");
                }
                return { polizaID: rows[0].polizaid, estado: rows[0].estado };
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error en obtenerPolizaID:", error.message);
                }
                else {
                    console.error("Error en obtenerPolizaID:", error);
                }
                throw error; // Relanzamos el error para ser manejado en la llamada `await`
            }
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
    obtenerDatosBeneficiario(siniestroID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield db_1.default.query(`SELECT b.email, b.nombre, b.apellido, t.nombre AS taller_nombre, t.direccion AS taller_direccion, t.telefono AS taller_telefono 
       FROM siniestros s
       JOIN beneficiario b ON s.beneficiarioid = b.beneficiarioid
       JOIN taller t ON s.tallerid = t.tallerid
       WHERE s.siniestroid = $1`, [siniestroID]);
            if (rows.length === 0) {
                throw new Error("Beneficiario o taller no encontrados para este siniestro");
            }
            return rows[0]; // Retorna el beneficiario y los detalles del taller
        });
    }
    cambiarEstado(siniestroid, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar que el estado sea permitido
            const estadosPermitidos = ["En proceso", "Culminado"];
            if (!estadosPermitidos.includes(estado)) {
                throw new Error("Estado inv谩lido. Solo se permite 'En proceso' o 'Culminado'.");
            }
            // Verificar si el siniestro existe
            const checkSiniestro = yield db_1.default.query("SELECT * FROM siniestros WHERE siniestroid = $1", [siniestroid]);
            if (checkSiniestro.rows.length === 0) {
                throw new Error("Siniestro no encontrado.");
            }
            // Actualizar el estado en la base de datos
            if (estado === "Culminado") {
                yield db_1.default.query("UPDATE siniestros SET estado = $1, tallerid = NULL WHERE siniestroid = $2", [estado, siniestroid]);
            }
            else {
                yield db_1.default.query("UPDATE siniestros SET estado = $1 WHERE siniestroid = $2", [estado, siniestroid]);
            }
        });
    }
    // Asignar un taller a un siniestro y enviar correo de confirmación
    asignarTallerASiniestro(siniestroID, tallerID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Obtener el taller anterior del siniestro
            const { rows } = yield db_1.default.query("SELECT tallerid FROM siniestros WHERE siniestroid = $1", [siniestroID]);
            const tallerPrevio = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.tallerid; // Puede ser null si nunca tuvo un taller
            // Actualizar el siniestro con el nuevo taller
            yield db_1.default.query("UPDATE siniestros SET tallerid = $1 WHERE siniestroid = $2", [tallerID, siniestroID]);
            // Obtener datos del beneficiario y del nuevo taller asignado
            const datosBeneficiario = yield this.obtenerDatosBeneficiario(siniestroID);
            // Configurar transporte de nodemailer
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "zavaletaryan.18@gmail.com",
                    pass: "lhox fhue lgcd dxpk",
                },
            });
            // Definir mensaje según si el taller fue asignado por primera vez o cambiado
            const mensajeInicio = tallerPrevio
                ? `Se le informa que el taller asignado a su siniestro ha sido cambiado. Ahora ha sido reasignado al siguiente taller:`
                : `Se le informa que su siniestro ha sido asignado al siguiente taller:`;
            // Contenido del correo
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: datosBeneficiario.email,
                subject: tallerPrevio
                    ? "🔄 Cambio de Taller - SegurosFlex"
                    : "📢 Asignación de Taller - SegurosFlex",
                html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: auto;">
            
            <!-- Logo -->
            <div style="text-align: center; font-size: 24px; font-weight: bold; color: #ff4d4d; margin-bottom: 10px;">
              🚗 SeguroFlex
            </div>

            <h3 style="color: #333; text-align: center;">Estimado/a ${datosBeneficiario.nombre} ${datosBeneficiario.apellido},</h3>
            
            <p style="color: #555; font-size: 16px;">
              ${mensajeInicio}
            </p>

            <!-- Información en tarjeta -->
            <div style="background-color: #eaf6ff; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>🏢 Taller:</strong> ${datosBeneficiario.taller_nombre}</p>
              <p><strong>📍 Dirección:</strong> ${datosBeneficiario.taller_direccion}</p>
              <p><strong>📞 Teléfono:</strong> ${datosBeneficiario.taller_telefono}</p>
            </div>

            <p style="color: #555;">Si tiene alguna consulta, no dude en comunicarse con nosotros.</p>

            <!-- Botón de contacto -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:5173/" 
                style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                🏠 Ir a la página
              </a>
            </div>

            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 20px;">
              Atentamente,<br>
              <strong style="color: #ff4d4d;">SeguroFlex</strong>
            </p>
          </div>
        </div>
      `,
            };
            // Enviar correo
            yield transporter.sendMail(mailOptions);
        });
    }
}
exports.default = new SiniestroService();

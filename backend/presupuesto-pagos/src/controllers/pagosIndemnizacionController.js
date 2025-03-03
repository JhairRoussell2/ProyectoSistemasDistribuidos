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
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
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
    generatePdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const query = `SELECT * FROM obtener_datos_factura($1)`;
                const result = yield db_1.default.query(query, [id]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Presupuesto no encontrado" });
                    return;
                }
                const datosFactura = result.rows[0];
                // Lee el archivo 'logo.png' y lo convierte a Base64
                const logoPath = path_1.default.join(__dirname, "..", "views", "logo.png");
                const logoFile = fs_1.default.readFileSync(logoPath, { encoding: "base64" });
                const templatePath = path_1.default.join(__dirname, "..", "views", "factura.ejs");
                // 2. Renderizar la plantilla EJS, pasando la imagen como base64
                const htmlContent = yield ejs_1.default.renderFile(templatePath, {
                    logoBase64: logoFile,
                    beneficiario: {
                        nombre: datosFactura.beneficiario_nombre,
                        apellido: datosFactura.beneficiario_apellido,
                        dni: datosFactura.beneficiario_dni,
                        telefono: datosFactura.beneficiario_telefono,
                        email: datosFactura.beneficiario_email
                    },
                    poliza: { tipopoliza: datosFactura.tipopoliza },
                    presupuesto: {
                        montototal: datosFactura.montototal,
                        fechacreacion: datosFactura.fechacreacion
                    },
                    taller: {
                        nombre: datosFactura.taller_nombre,
                        direccion: datosFactura.taller_direccion,
                        telefono: datosFactura.taller_telefono
                    },
                    vehiculo: {
                        marca: datosFactura.vehiculo_marca,
                        modelo: datosFactura.vehiculo_modelo,
                        tipo: datosFactura.vehiculo_tipo,
                        placa: datosFactura.vehiculo_placa
                    }
                });
                // 3. Generar el PDF con Puppeteer
                const browser = yield puppeteer_1.default.launch({
                    headless: true,
                    executablePath: puppeteer_1.default.executablePath(),
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-software-rasterizer"
                    ],
                });
                const page = yield browser.newPage();
                yield page.setContent(htmlContent, { waitUntil: "networkidle0" });
                const pdfBuffer = yield page.pdf({ format: "A4" });
                yield browser.close();
                // 4. Enviar el PDF al cliente
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=factura.pdf");
                res.end(pdfBuffer);
            }
            catch (error) {
                console.error("Error al generar el PDF:", error);
                res.status(500).json({ message: "Error al generar el PDF", error });
            }
        });
    }
}
exports.default = new pagosIndemnizacionController();

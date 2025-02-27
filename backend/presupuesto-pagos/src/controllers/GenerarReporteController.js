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
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class GenerarReporteController {
    // Devuelve la lista completa de reportes usando el filtro 'Validado' o 'Pagado'
    getReportesCompleto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT s.siniestroid, 
               s.fecha_siniestro, 
               TO_CHAR(s.fecha_siniestro, 'YYYY-MM-DD') AS fecha_siniestro, 
               s.descripcion, 
               t.nombre AS nombre_taller, 
               p.montototal, 
               p.estado
          FROM siniestros s
          JOIN presupuesto p ON s.siniestroid = p.siniestroid
          JOIN taller t ON s.tallerid = t.tallerid
         WHERE p.estado in('Validado', 'Pagado')
      `;
                const result = yield db_1.default.query(query);
                // Retornamos JSON (esto está bien, es la lista general)
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
               TO_CHAR(s.fecha_siniestro, 'YYYY-MM-DD') AS fecha_siniestro, 
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
                    return;
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                res.status(500).json({
                    message: "Error al obtener el reporte del siniestro",
                    error,
                });
            }
        });
    }
    // Generar PDF con Puppeteer
    generatePdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // 1. Consulta a la base de datos
                const query = `
        SELECT s.siniestroid, 
               TO_CHAR(s.fecha_siniestro, 'YYYY-MM-DD') AS fecha_siniestro, 
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
                    return;
                }
                const siniestro = result.rows[0];
                // 2. Renderizar la plantilla EJS
                const templatePath = path_1.default.join(__dirname, "..", "views", "reporte.ejs");
                const htmlContent = yield ejs_1.default.renderFile(templatePath, { siniestro });
                // 3. Generar el PDF con Puppeteer
                const browser = yield puppeteer_1.default.launch();
                const page = yield browser.newPage();
                yield page.setContent(htmlContent, { waitUntil: "networkidle0" });
                const pdfBuffer = yield page.pdf({ format: "A4" });
                yield browser.close();
                // 4. Enviar el PDF al cliente
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
                res.end(pdfBuffer);
            }
            catch (error) {
                console.error("Error al generar el PDF:", error);
                res.status(500).json({ message: "Error al generar el PDF", error });
            }
        });
    }
}
exports.default = new GenerarReporteController();

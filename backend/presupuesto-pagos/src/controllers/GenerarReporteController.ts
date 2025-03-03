// controllers/GenerarReporteController.ts
import { Request, Response } from "express";
import pool from "../config/db";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";

class GenerarReporteController {
  // ===============================
  // Tarjeta KPI Principal
  // ===============================
  /**
   * Obtiene un resumen general para el dashboard, incluyendo:
   * - Total de siniestros registrados
   * - Suma total de montos en presupuestos
   * - Promedio de presupuesto por siniestro (redondeado a 2 decimales)
   */
  public async getDashboardResumen(req: Request, res: Response): Promise<void> {
    try {
      const siniestrosResult = await pool.query(`
        SELECT COUNT(*) AS total FROM siniestros
      `);
      const totalSiniestros = parseInt(siniestrosResult.rows[0].total, 10);

      const presupuestoResult = await pool.query(`
        SELECT SUM(montototal) AS total_presupuestos, AVG(montototal) AS promedio
        FROM presupuesto
      `);
      const totalPresupuestos = parseFloat(presupuestoResult.rows[0].total_presupuestos) || 0;
      let promedioPresupuesto = parseFloat(presupuestoResult.rows[0].promedio) || 0;
      promedioPresupuesto = parseFloat(promedioPresupuesto.toFixed(2));

      res.json({ totalSiniestros, totalPresupuestos, promedioPresupuesto });
    } catch (error) {
      console.error("Error en getDashboardResumen:", error);
      res.status(500).json({ message: "Error al obtener el resumen del dashboard", error });
    }
  }

  // ===============================
  // Endpoints para Gráficos del Dashboard
  // ===============================

  /**
   * 1. Tendencia mensual de siniestros (formato MM-YYYY).
   */
  public async getSiniestrosTendencia(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT TO_CHAR(DATE_TRUNC('month', fecha_siniestro), 'MM-YYYY') AS mes,
               COUNT(*) AS total
        FROM siniestros
        GROUP BY DATE_TRUNC('month', fecha_siniestro)
        ORDER BY DATE_TRUNC('month', fecha_siniestro);
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getSiniestrosTendencia:", error);
      res.status(500).json({ message: "Error al obtener la tendencia de siniestros", error });
    }
  }

  /**
   * 2. Distribución de presupuestos por estado (con porcentaje).
   */
  public async getPresupuestosEstados(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT estado, COUNT(*) AS total, SUM(montototal) AS monto_total
        FROM presupuesto
        GROUP BY estado;
      `;
      const result = await pool.query(query);
      const data = result.rows;

      const parsedData = data.map((item: any) => ({
        ...item,
        total: Number(item.total)
      }));
      const totalBudgets = parsedData.reduce((sum: number, item: any) => sum + item.total, 0);
      const dataWithPercentage = parsedData.map((item: any) => {
        const rawPercentage = (item.total * 100) / totalBudgets;
        return {
          ...item,
          porcentaje: parseFloat(rawPercentage.toFixed(2))
        };
      });
      res.json(dataWithPercentage);
    } catch (error) {
      console.error("Error en getPresupuestosEstados:", error);
      res.status(500).json({ message: "Error al obtener los presupuestos por estado", error });
    }
  }

  /**
   * 3. Desglose de siniestros y presupuestos por taller (TODOS los talleres).
   */
  public async getTalleresDesglose(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT t.nombre AS taller,
               COUNT(s.siniestroid) AS total_siniestros,
               SUM(p.montototal) AS monto_total
        FROM siniestros s
        JOIN presupuesto p ON s.siniestroid = p.siniestroid
        JOIN taller t ON s.tallerid = t.tallerid
        GROUP BY t.nombre
        ORDER BY SUM(p.montototal) DESC;
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener el desglose por taller:", error);
      res.status(500).json({ message: "Error al obtener el desglose por taller", error });
    }
  }

  /**
   * 4. Distribución de siniestros por tipo (con porcentaje).
   */
  public async getSiniestrosPorTipo(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT tipo_siniestro, COUNT(*) AS total
        FROM siniestros
        GROUP BY tipo_siniestro;
      `;
      const result = await pool.query(query);
      const data = result.rows;

      const parsedData = data.map((item: any) => ({
        ...item,
        total: Number(item.total)
      }));
      const overallTotal = parsedData.reduce((sum: number, item: any) => sum + item.total, 0);
      const dataWithPercentage = parsedData.map((item: any) => {
        const rawPercentage = overallTotal > 0 ? (item.total * 100) / overallTotal : 0;
        return {
          ...item,
          porcentaje: parseFloat(rawPercentage.toFixed(2))
        };
      });
      res.json(dataWithPercentage);
    } catch (error) {
      console.error("Error en getSiniestrosPorTipo:", error);
      res.status(500).json({ message: "Error al obtener siniestros por tipo", error });
    }
  }

  /**
   * 5. Distribución de siniestros por distrito.
   */
  public async getSiniestrosPorDistrito(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT distrito, COUNT(*) AS total
        FROM siniestros
        GROUP BY distrito
        ORDER BY total DESC;
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getSiniestrosPorDistrito:", error);
      res.status(500).json({ message: "Error al obtener siniestros por distrito", error });
    }
  }

  /**
   * 6. Tendencia mensual de presupuestos (formato MM-YYYY).
   * Retorna, para cada mes, la suma y el promedio de montos presupuestados,
   * con el promedio redondeado a 2 decimales.
   */
  public async getPresupuestosTendencia(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT TO_CHAR(DATE_TRUNC('month', s.fecha_siniestro), 'MM-YYYY') AS mes,
               SUM(p.montototal) AS total_presupuestos,
               AVG(p.montototal) AS promedio_presupuesto
        FROM presupuesto p
        JOIN siniestros s ON s.siniestroid = p.siniestroid
        GROUP BY DATE_TRUNC('month', s.fecha_siniestro)
        ORDER BY DATE_TRUNC('month', s.fecha_siniestro);
      `;
      const result = await pool.query(query);
      const rows = result.rows.map((row: any) => ({
        ...row,
        promedio_presupuesto: parseFloat(parseFloat(row.promedio_presupuesto).toFixed(2))
      }));
      res.json(rows);
    } catch (error) {
      console.error("Error en getPresupuestosTendencia:", error);
      res.status(500).json({ message: "Error al obtener la tendencia de presupuestos", error });
    }
  }

  // ===============================
  // Función para generar PDF (sin porcentaje para PDF)
  // ===============================
  /**
   * Genera un PDF basado en el análisis seleccionado.
   * Se espera un parámetro "campo" en la query que determine el tipo de análisis.
   */
  public async generatePdf(req: Request, res: Response): Promise<void> {
    const campo = req.query.campo as string;

    if (!campo) {
      res.status(400).json({ message: "Debe especificarse el campo de análisis (campo)" });
      return;
    }

    try {
      let query = "";
      let templatePath = "";

      switch (campo) {
        case "tendencia":
          query = `
            SELECT TO_CHAR(DATE_TRUNC('month', fecha_siniestro), 'MM-YYYY') AS mes,
                   COUNT(*) AS total
            FROM siniestros
            GROUP BY DATE_TRUNC('month', fecha_siniestro)
            ORDER BY DATE_TRUNC('month', fecha_siniestro);
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_tendencia_siniestros.ejs");
          break;
        case "presupuestos_estados":
          query = `
            SELECT estado, COUNT(*) AS total, SUM(montototal) AS monto_total
            FROM presupuesto
            GROUP BY estado;
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_presupuestos_estados.ejs");
          break;
        case "talleres":
          query = `
            SELECT t.nombre AS taller,
                   COUNT(s.siniestroid) AS total_siniestros,
                   SUM(p.montototal) AS monto_total
            FROM siniestros s
            JOIN presupuesto p ON s.siniestroid = p.siniestroid
            JOIN taller t ON s.tallerid = t.tallerid
            GROUP BY t.nombre
            ORDER BY SUM(p.montototal) DESC;
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_talleres.ejs");
          break;
        case "siniestros_tipo":
          query = `
            SELECT tipo_siniestro, COUNT(*) AS total
            FROM siniestros
            GROUP BY tipo_siniestro;
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_siniestros_tipo.ejs");
          break;
        case "siniestros_distrito":
          query = `
            SELECT distrito, COUNT(*) AS total
            FROM siniestros
            GROUP BY distrito
            ORDER BY total DESC;
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_siniestros_distrito.ejs");
          break;
        case "presupuestos_tendencia":
          query = `
            SELECT TO_CHAR(DATE_TRUNC('month', s.fecha_siniestro), 'MM-YYYY') AS mes,
                   SUM(p.montototal) AS total_presupuestos,
                   AVG(p.montototal) AS promedio_presupuesto
            FROM presupuesto p
            JOIN siniestros s ON s.siniestroid = p.siniestroid
            GROUP BY DATE_TRUNC('month', s.fecha_siniestro)
            ORDER BY DATE_TRUNC('month', s.fecha_siniestro);
          `;
          templatePath = path.join(__dirname, "..", "views", "pdf_presupuestos_tendencia.ejs");
          break;
        default:
          res.status(400).json({ message: "Campo de análisis no válido" });
          return;
      }

      const result = await pool.query(query);
      let datos = result.rows;

      // Para el caso de "presupuestos_tendencia", redondeamos el promedio a 2 decimales
      if (campo === "presupuestos_tendencia") {
        datos = datos.map((row: any) => ({
          ...row,
          promedio_presupuesto: parseFloat(parseFloat(row.promedio_presupuesto).toFixed(2))
        }));
      }

      console.log("Ruta de la plantilla:", templatePath);
      const htmlContent = await ejs.renderFile(templatePath, { datos });

      console.log("Lanzando Puppeteer...");
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: puppeteer.executablePath(),
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
        ],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).json({ message: "Error al generar el PDF", error });
    }
  }
}

export default new GenerarReporteController();

// controllers/GenerarReporteController.ts
import { Request, Response } from "express";
import pool from "../config/db";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import fs from "fs";

class GenerarReporteController {
  // Devuelve la lista completa de reportes usando el filtro 'Validado'
  public async getReportesCompleto(req: Request, res: Response): Promise<void> {
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
      const result = await pool.query(query);
      res.json((result as any).rows);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener los reportes completos",
        error,
      });
    }
  }

  // Devuelve el detalle completo de un siniestro específico (por ID)
  public async getReporteDetalle(req: Request, res: Response): Promise<void> {
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
      const result = await pool.query(query, [id]);

      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "Siniestro no encontrado" });
      } else {
        res.json((result as any).rows[0]);
      }
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener el reporte del siniestro",
        error,
      });
    }
  }
  public async generatePdf(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // 1. Consulta a la base de datos (similar a getReporteDetalle)
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
      const result = await pool.query(query, [id]);
      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "Siniestro no encontrado" });
        return;
      }

      const siniestro = (result as any).rows[0];

      // 2. Renderizamos la plantilla EJS, pasando siniestro como variable
      const templatePath = path.join(__dirname, "..", "views", "reporte.ejs");
      const htmlContent = await ejs.renderFile(templatePath, { siniestro });

      // 3. Generamos el PDF con Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      // 4. Enviamos el PDF al cliente
      res.setHeader("Content-Type", "application/pdf");
      // Opcional: forzar descarga con un nombre
      res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
      res.send(pdfBuffer);

    } catch (error) {
      res.status(500).json({ message: "Error al generar el PDF", error });
    }
  }

}

export default new GenerarReporteController();

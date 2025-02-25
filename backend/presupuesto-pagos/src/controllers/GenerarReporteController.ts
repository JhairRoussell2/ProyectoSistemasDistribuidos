// controllers/GenerarReporteController.ts
import { Request, Response } from "express";
import pool from "../config/db";

class GenerarReporteController {
  // Devuelve la lista completa de reportes usando el filtro 'Validado'
  public async getReportesCompleto(req: Request, res: Response): Promise<void> {
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
}

export default new GenerarReporteController();

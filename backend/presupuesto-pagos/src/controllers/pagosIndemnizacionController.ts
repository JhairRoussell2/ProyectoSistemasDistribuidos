import { Request, Response } from "express";
import pool from "../config/db";
class pagosIndemnizacionController {
    // Obtener datos importantes de presupuestos validados y pagados
    public async getIndemnizaciones(req: Request, res: Response): Promise<void> {
        try {
            // Llamada a la función 'get_indemnizaciones()' que devuelve todos los datos necesarios
            const result = await pool.query("SELECT * FROM public.get_indemnizaciones()");
            res.json((result as any).rows);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las indemnizaciones", error });
        }
    }
    // Actualizar estado de un presupuesto a "Pagado" si estaba en "Validado"
    public async updateEstadoAPagado(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Se requiere id" });
                return;
            }

            const result = await pool.query(
                "UPDATE presupuesto SET estado = 'Pagado' WHERE presupuestoid = $1 AND estado = 'Validado' RETURNING *",
                [id]
            );

            if (result.rowCount === 0) {
                res.status(400).json({ message: "Presupuesto no encontrado o no está en estado 'Validado'" });
            } else {
                const presupuesto = result.rows[0];
                res.json({
                    message: `El pago de indemnización para el siniestro SIN-${presupuesto.siniestroid} por un monto de S/.${presupuesto.montototal} ha sido procesado correctamente.`,
                    data: presupuesto
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el estado", error });
        }
    }
  }
  
export default new pagosIndemnizacionController();
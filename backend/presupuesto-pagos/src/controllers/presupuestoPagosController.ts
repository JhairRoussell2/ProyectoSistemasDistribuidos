import { Request, Response } from "express";
import pool from "../config/db";

class PresupuestoPagosController {
  // Obtener datos importantes de presupuestos pendientes
  public async getPresupuestosPendientes(req: Request, res: Response): Promise<void> {
    try {
      // Llamada a la función 'get_presupuestos_pendientes()' que devuelve todos los datos necesarios de presupuestos pendientes
      const result = await pool.query("SELECT * FROM public.get_presupuestos_pendientes()");
      res.json((result as any).rows);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los presupuestos", error });
    }
  }
  // Obtener presupuesto por ID
  public async getPresupuestoById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Llamada a la función 'get_presupuesto_by_id' para obtener el presupuesto por su ID
      const result = await pool.query("SELECT * FROM public.get_presupuesto_by_id($1)", [id]);

      // Si no se encuentra el presupuesto
      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "Presupuesto no encontrado" });
      } else {
        res.json((result as any).rows[0]); 
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el presupuesto", error });
    }
  }
  // Actualizar un presupuesto
public async updatePresupuesto(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { 
    montototal, 
    costo_reparacion, 
    costo_piezas_mano_obra, 
    detalle_presupuesto 
  } = req.body;

  try {
    // Llamada a la función 'update_presupuesto' para actualizar los datos del presupuesto
    await pool.query(
      "SELECT public.update_presupuesto($1, $2, $3, $4, $5, $6, $7)", 
      [
        id, // ID del presupuesto a actualizar
        montototal, 
        costo_reparacion, 
        costo_piezas_mano_obra, 
        detalle_presupuesto, 
        'Validado',  
        new Date().toISOString()
      ]
    );

    res.json({ message: "Presupuesto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el presupuesto", error });
  }
}
//Obtener documento de siniestro
public async getDocumentosPresupuesto(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    // Llamada a la función 'get_documento_siniestro' para obtener el documento del siniestro
    const result = await pool.query("SELECT * FROM public.obtener_documentos($1)", [id]);
    // Si no se encuentra el documento
    if ((result as any).rows.length === 0) {
      res.status(404).json({ message: "Documento no encontrado" });
    } else {
      res.json((result as any).rows[0]); 
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el documento", error });
  }

}
//Obtener poliza por presupuestoid
public async getPolizaByPresupuestoId(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    // Llamada a la función 'obtener_poliza_por_presupuesto' para obtener la poliza por presupuesto id
    const result = await pool.query("SELECT * FROM public.obtener_poliza_por_presupuesto($1)", [id]);
    // Si no se encuentra la poliza
    if ((result as any).rows.length === 0) {
      res.status(404).json({ message: "Poliza no encontrada" });
    } else {
      res.json((result as any).rows[0]); 
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la poliza", error });
  }
}
}
export default new PresupuestoPagosController();

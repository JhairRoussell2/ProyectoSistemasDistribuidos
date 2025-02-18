import { Request, Response } from "express";
import pool from "../config/db";

class GestionReclamacionesController {
  // Obtener todas las reclamaciones con su estado
  public async obtenerTodasLasReclamaciones(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result = await pool.query(
        `SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         GROUP BY r.reclamacionid`
      );
      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "No se encontraron reclamaciones." });
      } else {
        res.json((result as any).rows);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las reclamaciones", error });
    }
  }

  // Obtener detalles de una reclamación específica
  public async obtenerDetallesReclamacion(
    req: Request,
    res: Response
  ): Promise<void> {
    const { reclamacionid } = req.params;
    try {
      const result = await pool.query(
        `SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         WHERE r.reclamacionid = $1
         GROUP BY r.reclamacionid`,
        [reclamacionid]
      );

      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "Reclamación no encontrada" });
      } else {
        res.json((result as any).rows[0]);
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error al obtener detalles de la reclamación",
          error,
        });
    }
  }

  // Actualizar el estado de una reclamación
  public async actualizarEstadoReclamacion(
    req: Request,
    res: Response
  ): Promise<void> {
    const { reclamacionid } = req.params;
    const { estado, observacion } = req.body;

    try {
      const estadosValidos = [
        "Por Atender",
        "En Proceso",
        "Observada",
        "Resuelta",
        "Corregida",
      ];
      if (!estadosValidos.includes(estado)) {
        res.status(400).json({ message: "Estado inválido." });
        return;
      }

      await pool.query(
        `UPDATE reclamacion 
         SET estado = $1, observacion = $2 
         WHERE reclamacionid = $3`,
        [estado, observacion, reclamacionid]
      );

      res.json({ message: "Estado de la reclamación actualizado con éxito." });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error al actualizar el estado de la reclamación",
          error,
        });
    }
  }

  // Eliminar una reclamación
  public async eliminarReclamacion(req: Request, res: Response): Promise<void> {
    const { reclamacionid } = req.params;
    try {
      const { rowCount } = await pool.query(
        "SELECT * FROM reclamacion WHERE reclamacionid = $1",
        [reclamacionid]
      );

      if (rowCount === 0) {
        res.status(404).json({ message: "Reclamación no encontrada." });
        return;
      }

      // Eliminar los documentos relacionados
      await pool.query(
        "DELETE FROM documentosreclamacion WHERE reclamacionid = $1",
        [reclamacionid]
      );

      // Eliminar la reclamación
      await pool.query("DELETE FROM reclamacion WHERE reclamacionid = $1", [
        reclamacionid,
      ]);

      res.json({ message: "Reclamación eliminada con éxito." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar la reclamación", error });
    }
  }

  // Backend: Validar un solo documento
 
  public async validarDocumentos(req: Request, res: Response): Promise<void> {
    const { reclamacionid } = req.params;
    try {
      // Consulta los documentos relacionados con la reclamación
      const result = await pool.query(
        `SELECT d.documentoid, d.nombre, d.extension, d.url, d.estado_documento
         FROM documentosreclamacion d
         WHERE d.reclamacionid = $1`,
        [reclamacionid]
      );
  
      if ((result as any).rows.length === 0) {
        res.status(404).json({ message: "No se encontraron documentos para esta reclamación." });
        return;
      }
  
      // Filtrar los documentos válidos (ejemplo: solo archivos PDF y PNG)
      const documentosValidos = (result as any).rows.filter((doc: any) => {
        return doc.extension === 'pdf' || doc.extension === 'png';
      });
  
      if (documentosValidos.length === 0) {
        res.status(400).json({ message: "Ningún documento válido encontrado." });
        return;
      }
  
      // Extrae los IDs de los documentos válidos
      const documentosIds = documentosValidos.map((doc: any) => doc.documentoid);
  
      // Actualiza el estado de los documentos a 'Validado'
      await pool.query(
        `UPDATE documentosreclamacion 
         SET estado_documento = 'Validado' 
         WHERE reclamacionid = $1 AND documentoId = ANY($2::int[])`,
        [reclamacionid, documentosIds]
      );
  
      res.json({ message: "Documentos validados con éxito." });
    } catch (error) {
      res.status(500).json({ message: "Error al validar los documentos", error });
    }
  }

  // Nuevo método en el controlador para buscar por ID de Reclamación o ID de Siniestro
// Nuevo método en el controlador para buscar por ID de Reclamación
public async buscarReclamacionPorId(req: Request, res: Response): Promise<void> {
  const { reclamacionid } = req.params; // Obtener el ID de la URL

  try {
    // Realizar la consulta para buscar la reclamación por ID
    const result = await pool.query(
      `SELECT r.*, json_agg(d.*) AS documentos
       FROM reclamacion r
       LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
       WHERE r.reclamacionid = $1
       GROUP BY r.reclamacionid`,
      [reclamacionid] // Filtrar por ID de reclamación
    );

    if ((result as any).rows.length === 0) {
      res.status(404).json({ message: "Reclamación no encontrada" });
    } else {
      res.json((result as any).rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al buscar reclamación", error });
  }
}




}
export default new GestionReclamacionesController();

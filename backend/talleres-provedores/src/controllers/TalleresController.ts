import { Request, Response } from "express";
import pool from "../config/db";

class TalleresController {
  // Obtener todos los talleres con sus proveedores (muchos a muchos)
  public async getTalleres(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono,
               (
                 SELECT json_agg(
                          json_build_object(
                            'proveedor_id', p.id_proveedor,
                            'proveedor_nombre', p.nombre_proveedor
                          )
                        )
                 FROM talleres_proveedores tp
                 JOIN proveedores p ON tp.proveedor_id = p.id_proveedor
                 WHERE tp.taller_id = t.tallerid
               ) AS proveedores
        FROM taller t
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los talleres", error });
    }
  }

  // Obtener un taller por ID con sus proveedores
  public async getTallerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono,t.estadoactual,
               (
                 SELECT json_agg(
                          json_build_object(
                            'proveedor_id', p.id_proveedor,
                            'proveedor_nombre', p.nombre_proveedor
                          )
                        )
                 FROM talleres_proveedores tp
                 JOIN proveedores p ON tp.proveedor_id = p.id_proveedor
                 WHERE tp.taller_id = t.tallerid
               ) AS proveedores
        FROM taller t
        WHERE t.tallerid = $1
      `, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: "Taller no encontrado" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el taller", error });
    }
  }

  // Crear un nuevo taller (con múltiples proveedores)
  public async createTaller(req: Request, res: Response): Promise<void> {
    const { nombre, direccion, capacidad, telefono, proveedores } = req.body;
    const estado = "Disponible"; // Estado por defecto

    try {
      // Insertar el taller y obtener su ID
      const result = await pool.query(
        "INSERT INTO taller (nombre, direccion, capacidad, estado, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING tallerid",
        [nombre, direccion, capacidad, estado, telefono]
      );
      const tallerId = result.rows[0].tallerid;

      // Insertar las asociaciones en la tabla intermedia, si se proporcionaron proveedores
      if (proveedores && Array.isArray(proveedores)) {
        for (const proveedorId of proveedores) {
          await pool.query(
            "INSERT INTO talleres_proveedores (taller_id, proveedor_id) VALUES ($1, $2)",
            [tallerId, proveedorId]
          );
        }
      }

      res.json({ message: "Taller creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el taller", error });
    }
  }

  // Actualizar un taller y sus asociaciones de proveedores
  public async updateTaller(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nombre, direccion, capacidad, estado, telefono, proveedores } = req.body;
    
    try {
      // Actualizar los datos básicos del taller
      await pool.query(
        "UPDATE taller SET nombre = $1, direccion = $2, capacidad = $3, estado = $4, telefono = $5 WHERE tallerid = $6",
        [nombre, direccion, capacidad, estado, telefono, id]
      );

      // Eliminar las asociaciones existentes en la tabla intermedia para este taller
      await pool.query("DELETE FROM talleres_proveedores WHERE taller_id = $1", [id]);

      // Insertar las nuevas asociaciones
      if (proveedores && Array.isArray(proveedores)) {
        for (const proveedorId of proveedores) {
          await pool.query(
            "INSERT INTO talleres_proveedores (taller_id, proveedor_id) VALUES ($1, $2)",
            [id, proveedorId]
          );
        }
      }

      res.json({ message: "Taller actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el taller", error });
    }
  }

  // Eliminar un taller
public async deleteTaller(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    // Verificar si el taller tiene siniestros asignados usando el campo estadoactual
    const result = await pool.query("SELECT estadoactual FROM taller WHERE tallerid = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Taller no encontrado" });
    }

    const estadoActual = result.rows[0].estadoactual;

    // Si el contador de siniestros es mayor que 0, no se puede eliminar el taller
    if (estadoActual > 0) {
      res.status(400).json({ message: "No se puede eliminar el taller porque tiene siniestros asignados." });
      return;
    }

    // Si no tiene siniestros, proceder con la eliminación
    await pool.query("DELETE FROM taller WHERE tallerid = $1", [id]);
    res.json({ message: "Taller eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el taller", error });
  }
}
}

export default new TalleresController();

import { Request, Response } from "express";
import pool from "../config/db";

class TalleresController {
  // Obtener todos los talleres con el nombre del proveedor
  public async getTalleres(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono, 
               p.nombre_proveedor AS proveedor_nombre, p.id_proveedor AS proveedor_id
        FROM taller t
        JOIN proveedores p ON t.proveedor_id = p.id_proveedor
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los talleres", error });
    }
  }

  // Obtener un taller por ID con el nombre del proveedor
  public async getTallerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono, 
               p.nombre_proveedor AS proveedor_nombre, p.id_proveedor AS proveedor_id
        FROM taller t
        JOIN proveedores p ON t.proveedor_id = p.id_proveedor
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

  // Crear un nuevo taller (con proveedor)
  public async createTaller(req: Request, res: Response): Promise<void> {
    const { nombre, direccion, capacidad, telefono, proveedor_id } = req.body;
    const estado = "Disponible"; // Estado por defecto

    try {
      await pool.query(
        "INSERT INTO taller (nombre, direccion, capacidad, estado, telefono, proveedor_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [nombre, direccion, capacidad, estado, telefono, proveedor_id]
      );
      res.json({ message: "Taller creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el taller", error });
    }
  }

  // Actualizar un taller (incluyendo proveedor)
  public async updateTaller(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nombre, direccion, capacidad, estado, telefono, proveedor_id } = req.body;
    
    try {
      await pool.query(
        "UPDATE taller SET nombre = $1, direccion = $2, capacidad = $3, estado = $4, telefono = $5, proveedor_id = $6 WHERE tallerid = $7",
        [nombre, direccion, capacidad, estado, telefono, proveedor_id, id]
      );
      res.json({ message: "Taller actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el taller", error });
    }
  }

  // Eliminar un taller
  public async deleteTaller(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM taller WHERE tallerid = $1", [id]);
      res.json({ message: "Taller eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el taller", error });
    }
  }
}

export default new TalleresController();

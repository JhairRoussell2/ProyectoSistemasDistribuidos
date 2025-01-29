import { Request, Response } from "express";
import pool from "../config/db";

class ProveedoresController {
  // Obtener todos los proveedores
  public async getProveedores(req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.query("CALL GetAllProveedores()");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los proveedores", error });
    }
  }

  public async getProveedorById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const [result]: any = await pool.query("CALL GetProveedorById(?)", [id]);

      // MySQL devuelve los resultados en un array anidado cuando se usa CALL
      const rows = result[0];

      if (rows.length > 0) {
        res.json(rows[0]); // Retorna el primer resultado
      } else {
        res.status(404).json({ message: "Proveedor no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el proveedor", error });
    }
  }

  // Crear un nuevo proveedor
  public async createProveedor(req: Request, res: Response): Promise<void> {
    const { Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas } = req.body;
    try {
      await pool.query("CALL CreateProveedor(?, ?, ?, ?, ?, ?, ?, ?)", [Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas]);
      res.json({ message: "Proveedor creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el proveedor", error });
    }
  }

  // Actualizar un proveedor
  public async updateProveedor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas } = req.body;
    try {
      await pool.query("CALL UpdateProveedor(?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas]);
      res.json({ message: "Proveedor actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el proveedor", error });
    }
  }

  // Eliminar un proveedor
  public async deleteProveedor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await pool.query("CALL DeleteProveedor(?)", [id]);
      res.json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el proveedor", error });
    }
  }
}

export default new ProveedoresController();
import { Request, Response } from "express";
import pool from "../config/db";

class ProveedoresController {
  // Obtener todos los proveedores
  public async getProveedores(req: Request, res: Response): Promise<void> {
    try {
      // Llamada a la función 'getallproveedores' que devuelve todos los proveedores
      const result = await pool.query("SELECT * FROM public.getallproveedores()");
      res.json(result.rows);  // Acceder correctamente a 'rows'
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los proveedores", error });
    }
  }

  // Obtener proveedor por ID
  public async getProveedorById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Llamada a la función 'getproveedorbyid' para obtener el proveedor por su ID
      const result = await pool.query("SELECT * FROM public.getproveedorbyid($1)", [id]);

      // Si no se encuentra el proveedor
      if (result.rows.length === 0) {
        res.status(404).json({ message: "Proveedor no encontrado" });
      } else {
        res.json(result.rows[0]);  // Retorna el primer resultado
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el proveedor", error });
    }
  }

  // Crear un nuevo proveedor
  public async createProveedor(req: Request, res: Response): Promise<void> {
    const { nombre_proveedor, direccion, telefono_proveedor, correo_electronico, tipo_proveedor, estado_proveedor, valoracion, notas } = req.body;
    try {
      // Llamada a la función 'createproveedor' para crear un nuevo proveedor
      await pool.query(
        "SELECT public.createproveedor($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          nombre_proveedor, 
          direccion, 
          telefono_proveedor, 
          correo_electronico, 
          tipo_proveedor, 
          estado_proveedor, 
          valoracion, 
          notas
        ]
      );
      res.json({ message: "Proveedor creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el proveedor", error });
    }
  }

  // Actualizar un proveedor
  public async updateProveedor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nombre_proveedor, direccion, telefono_proveedor, correo_electronico, tipo_proveedor, estado_proveedor, valoracion, notas } = req.body;
    try {
      // Llamada a la función 'updateproveedor' para actualizar los datos del proveedor
      await pool.query(
        "SELECT public.updateproveedor($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          id, // El ID del proveedor que se está actualizando
          nombre_proveedor, 
          direccion, 
          telefono_proveedor, 
          correo_electronico, 
          tipo_proveedor, 
          estado_proveedor, 
          valoracion, 
          notas
        ]
      );
      res.json({ message: "Proveedor actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el proveedor", error });
    }
  }

  // Eliminar un proveedor
  public async deleteProveedor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Llamada a la función 'deleteproveedor' para eliminar un proveedor
      await pool.query("SELECT public.deleteproveedor($1)", [id]);
      res.json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el proveedor", error });
    }
  }
}

export default new ProveedoresController();

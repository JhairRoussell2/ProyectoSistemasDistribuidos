import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";
import pool from "../config/db";

// Esquema de validación
const schema = Joi.object({
  Nombre: Joi.string().max(100).required(),
  Apellido: Joi.string().max(100).required(),
  DNI: Joi.string().length(8).required(),
  Email: Joi.string().email().required(),
  Telefono: Joi.string().max(15).required(),
});

// Controlador para obtener beneficiarios
export const getBeneficiarios = async (req: Request, res: Response) => {
    try {
      console.log("Intentando conectar con la base de datos...");
      const [result]: any = await pool.query("SELECT * FROM beneficiario");
      console.log("Datos obtenidos de la base de datos:", result);

      if (!result || result.length === 0) {
        console.log("No se encontraron beneficiarios.");
        res.status(404).json({ message: "No se encontraron beneficiarios." });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error en getBeneficiarios:", error);
      res.status(500).json({ error: "Error al obtener beneficiarios" });
    }
};

// Controlador para crear un beneficiario
export const createBeneficiario: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      console.log("Solicitud recibida para crear beneficiario:", req.body);
  
      const { error } = schema.validate(req.body);
      if (error) {
        console.error("Error de validación:", error.details[0].message);
        res.status(400).json({ error: error.details[0].message });
        return;
      }
  
      const { Nombre, Apellido, DNI, Email, Telefono } = req.body;
  
      const [existing]: any = await pool.query(
        "SELECT * FROM beneficiario WHERE DNI = ? OR Email = ?",
        [DNI, Email]
      );
  
      if (existing.length > 0) {
        res.status(400).json({ error: "El DNI o Email ya están registrados." });
        return;
      }
  
      const [result]: any = await pool.query(
        "INSERT INTO beneficiario (Nombre, Apellido, DNI, Email, Telefono) VALUES (?, ?, ?, ?, ?)",
        [Nombre, Apellido, DNI, Email, Telefono]
      );
  
      console.log("Beneficiario creado con ID:", result.insertId);
  
      res.status(201).json({
        message: "Beneficiario creado exitosamente",
        beneficiarioId: result.insertId,
      });
    } catch (error) {
      console.error("Error al crear beneficiario:", error);
      next(error);
    }
  };

// Controlador para eliminar un beneficiario
export const deleteBeneficiario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const [result]: any = await pool.query("DELETE FROM beneficiario WHERE BeneficiarioID = ?", [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({ message: "Beneficiario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar beneficiario:", error);
    next(error);
  }
};

// Controlador para actualizar un beneficiario
export const updateBeneficiario = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { error } = schema.validate(req.body);
  
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }
  
      const { Nombre, Apellido, DNI, Email, Telefono } = req.body;
  
      const [result]: any = await pool.query(
        "UPDATE beneficiario SET Nombre = ?, Apellido = ?, DNI = ?, Email = ?, Telefono = ? WHERE BeneficiarioID = ?",
        [Nombre, Apellido, DNI, Email, Telefono, id]
      );
  
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Beneficiario no encontrado." });
        return;
      }
  
      res.status(200).json({ message: "Beneficiario actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar beneficiario:", error);
      next(error);
    }
};

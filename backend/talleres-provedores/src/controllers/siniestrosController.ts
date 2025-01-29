import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import pool from "../config/db";

// Esquema de validación
const schema = Joi.object({
  tipoSiniestro: Joi.string().max(50).required(),
  fechaSiniestro: Joi.date().required(),
  departamento: Joi.string().max(100).required(),
  distrito: Joi.string().max(100).required(),
  provincia: Joi.string().max(100).required(),
  ubicacion: Joi.string().max(255).required(),
  descripcion: Joi.string().required(),
  documentos: Joi.array().items(Joi.string().uri()).optional(),
});

// Controlador para registrar un siniestro
export const registrarSiniestro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validar los datos enviados
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const {
      tipoSiniestro,
      fechaSiniestro,
      departamento,
      distrito,
      provincia,
      ubicacion,
      descripcion,
      documentos = [],
    } = req.body;

    // Insertar en la base de datos
    const [result]: any = await pool.query(
      `INSERT INTO siniestros 
      (tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipoSiniestro,
        fechaSiniestro,
        departamento,
        distrito,
        provincia,
        ubicacion,
        descripcion,
        JSON.stringify(documentos),
      ]
    );

    res.status(201).json({
      message: "Siniestro registrado con éxito",
      siniestroId: result.insertId,
    });
  } catch (error) {
    console.error("Error al registrar siniestro:", error);
    next(error);
  }
};

// Controlador para listar todos los siniestros
export const listarSiniestros = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [result]: any = await pool.query("SELECT * FROM siniestros");

    // Si no hay resultados
    if (result.length === 0) {
      res.status(404).json({ message: "No se encontraron siniestros." });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al listar siniestros:", error);
    next(error);
  }
};

import { Request, Response } from "express";
import Joi from "joi";
import pool from "../config/db";

// Esquema de validación para los vehículos
const schema = Joi.object({
  placa: Joi.string().max(50).required(),
  marca: Joi.string().max(50).required(),
  modelo: Joi.string().max(50).required(),
  tipo: Joi.string().max(50).required(),
  beneficiarioid: Joi.number().integer().required(), 
});

// 📌 Obtener todos los vehículos
export const getVehiculos = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM vehiculo ORDER BY vehiculoid ASC");
    if (rows.length === 0) {
      res.status(404).json({ message: "No se encontraron vehículos." });
      return;
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en getVehiculos:", error);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
};

// 📌 Obtener un vehículo por su ID
export const getVehiculoPorID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM vehiculo WHERE vehiculoid = $1", [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: "Vehículo no encontrado." });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error en getVehiculoPorID:", error);
    res.status(500).json({ error: "Error al obtener el vehículo" });
  }
};

// 📌 Registrar un nuevo vehículo
export const createVehiculo = async (req: Request, res: Response) => {
  try {
    console.log("Datos recibidos:", req.body); // 🔍 Agregar este log
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { placa, marca, modelo, tipo, beneficiarioid } = req.body; // ✅ Se incluye beneficiarioid
    console.log("Insertando en BD:", placa, marca, modelo, tipo, beneficiarioid); // 🔍 Log

    const { rows } = await pool.query(
      "INSERT INTO vehiculo (placa, marca, modelo, tipo, beneficiarioid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [placa, marca, modelo, tipo, beneficiarioid]
    );

    res.status(201).json({ message: "Vehículo registrado correctamente", vehiculo: rows[0] });
  } catch (error) {
    console.error("Error en createVehiculo:", error);
    res.status(500).json({ error: "Error al registrar el vehículo" });
  }
};

// 📌 Actualizar información de un vehículo
export const updateVehiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { placa, marca, modelo, tipo, beneficiarioid } = req.body; // ✅ Se incluye beneficiarioid

    const result = await pool.query(
      "UPDATE vehiculo SET placa = $1, marca = $2, modelo = $3, tipo = $4 WHERE vehiculoid = $5 RETURNING *",
      [placa, marca, modelo, tipo, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Vehículo no encontrado" });
      return;
    }

    res.status(200).json({ message: "Vehículo actualizado correctamente", data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar el vehículo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 📌 Eliminar un vehículo
export const deleteVehiculo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM vehiculo WHERE vehiculoid = $1", [id]);

    if (rowCount === 0) {
      res.status(404).json({ message: "Vehículo no encontrado." });
      return;
    }

    res.status(200).json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteVehiculo:", error);
    res.status(500).json({ error: "Error al eliminar el vehículo" });
  }
};
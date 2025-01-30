import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";
import pool from "../config/db";
import bcrypt from "bcrypt";

// Esquema de validación
const schema = Joi.object({
  Nombre: Joi.string().max(100).required(),
  Apellido: Joi.string().max(100).required(),
  DNI: Joi.string().length(8).required(),
  Email: Joi.string().email().required(),
  Telefono: Joi.string().max(15).required(),
  Password: Joi.string().min(6).required(),
  ConfirmPassword: Joi.ref("Password"),
});

// Controlador para obtener beneficiarios
export const getBeneficiarios = async (req: Request, res: Response) => {
  try {
    console.log("Intentando conectar con la base de datos...");
    const [result] = await pool.query("CALL GetBeneficiarios()");
    console.log("Datos obtenidos de la base de datos:", result);
    if (!result) {
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

export const getBeneficiarioPorID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Llamada al procedimiento almacenado para obtener el beneficiario
    const [result] = await pool.query("CALL GetBeneficiarioPorID(?)", [id]);

    if (!result) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({
      message: "Beneficiario encontrado"
    });  // Devuelve el primer beneficiario encontrado
  } catch (error) {
    console.error("Error al obtener beneficiario por ID:", error);
    next(error);
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

    const { Nombre, Apellido, DNI, Email, Telefono, Password, ConfirmPassword } = req.body;

    // Verifica que las contraseñas coincidan
    if (Password !== ConfirmPassword) {
      res.status(400).json({ error: 'Las contraseñas no coinciden' });
      return;
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Llamada al procedimiento almacenado para crear el usuario y el beneficiario
    await pool.query(
      "CALL sp_RegisterBeneficiario(?, ?, ?, ?, ?, ?)",
      [Nombre, Apellido, Email, hashedPassword, DNI, Telefono]
    );

    console.log("Beneficiario creado exitosamente");

    res.status(201).json({
      message: "Beneficiario creado exitosamente",
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

    // Llamada al procedimiento almacenado para eliminar el beneficiario
    const [result]: any = await pool.query("CALL DeleteBeneficiario(?)", [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({ message: "Beneficiario y usuario eliminados exitosamente" });
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

    const { Nombre, Apellido, DNI, Email, Telefono,Password } = req.body;

    const hashedPassword = await bcrypt.hash(Password, 10);

    const [result]: any = await pool.query(
      "CALL UpdateBeneficiario(?, ?, ?, ?, ?, ?,?)",
      [id, Nombre, Apellido, DNI, Email, Telefono, hashedPassword]
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

export const checkIfNewBeneficiario = async (req: Request, res: Response) => {
  const { BeneficiarioID } = req.params;

  try {
    // Verificar si el beneficiario tiene alguna póliza activa
    const [rows]: any = await pool.query("SELECT COUNT(*) as count FROM poliza WHERE BeneficiarioID = ? AND Estado = 'Activo'", [BeneficiarioID]);
    
    if (rows[0].count === 0) {
      // Si no tiene póliza activa, responder que es nuevo
      res.status(200).json({ isNew: true });
    } else {
      // Si tiene pólizas activas, responder que no es nuevo
      res.status(200).json({ isNew: false });
    }
  } catch (error) {
    console.error("Error al verificar beneficiario:", error);
    res.status(500).json({ error: "Error al verificar el beneficiario" });
  }
};
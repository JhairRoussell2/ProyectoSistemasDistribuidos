import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/email";

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

export const login = async (req: Request, res: Response): Promise<void> => {
  const { Email, Password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico
    const user = await findUserByEmail(Email);

    // Verificar si el usuario existe
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' }); // Usa return aquí
      return;
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      res.status(401).json({ error: 'Contraseña incorrecta' });
      return;  // Usa return aquí
    }

    // Generar un token JWT (si es necesario)
    // const token = generateToken({ UsuarioID: user.UsuarioID, Rol: user.Rol });

    // Responder con éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        UsuarioID: user.UsuarioID,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Email: user.Email,
        Rol: user.Rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
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

// Controlador para obtener el rol del usuario
export const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { UsuarioID } = req.params;

    // Consulta directa a la base de datos para obtener el rol del usuario
    const [rows]: any = await pool.query("SELECT Rol FROM usuario WHERE UsuarioID = ?", [UsuarioID]);

    // Verificar si el usuario existe
    if (rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return; // Agregar return para evitar que el código continúe ejecutándose
    }

    const user = rows[0]; // Asumiendo que rows[0] contiene el objeto del usuario
    console.log(user);

    // Enviar el rol del usuario como respuesta
    res.status(200).json({ role: user.Rol });
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    next(error); // Pasa el error al middleware global de errores
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
  console.log(BeneficiarioID);
  try {
    // Verificar si el beneficiario tiene alguna póliza activa
    const [rows]: any = await pool.query("select count(*) as count from poliza INNER JOIN beneficiario on beneficiario.BeneficiarioID = poliza.BeneficiarioID WHERE UsuarioID = ?", [BeneficiarioID]);
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
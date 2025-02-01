import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/email";

// Esquema de validación
const schema = Joi.object({
  nombre: Joi.string().max(100).required(),
  apellido: Joi.string().max(100).required(),
  dni: Joi.string().length(8).required(),
  email: Joi.string().email().required(),
  telefono: Joi.string().max(15).required(),
  password: Joi.string().min(6).required(),
  ConfirmPassword: Joi.ref("Password"),
  usuarioid: Joi.number().integer().required()
  // Elimina la validación de UsuarioID, ya que es generado en la base de datos
});


// Controlador para obtener beneficiarios
export const getBeneficiarios = async (req: Request, res: Response) => {
  try {
    console.log("Intentando conectar con la base de datos...");
    const { rows } = await pool.query("SELECT * FROM beneficiario");  // Llamada a la función en PostgreSQL
    console.log("Datos obtenidos de la base de datos:", rows);
    if (rows.length === 0) {
      console.log("No se encontraron beneficiarios.");
      res.status(404).json({ message: "No se encontraron beneficiarios." });
      return;
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en getBeneficiarios:", error);
    res.status(500).json({ error: "Error al obtener beneficiarios" });
  }
};

export const getBeneficiarioPorUsuarioID = async (req: Request, res: Response) => {
  const { UsuarioID } = req.params;
  try {
    const { rows }: any = await pool.query("SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [UsuarioID]);
    if (rows.length === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }
    res.status(200).json({ BeneficiarioID: rows[0].BeneficiarioID });
  } catch (error) {
    console.error("Error al obtener BeneficiarioID:", error);
    res.status(500).json({ error: "Error al obtener BeneficiarioID" });
  }
};

export const getBeneficiarioPorID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Llamada al procedimiento almacenado para obtener el beneficiario
    const { rows } = await pool.query("SELECT * FROM get_beneficiario_por_id($1)", [id]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({
      message: "Beneficiario encontrado",
      beneficiario: rows[0]
    });
  } catch (error) {
    console.error("Error al obtener beneficiario por ID:", error);
    next(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { Email, Password } = req.body;
  console.log('Email:', Email);
  console.log('Password:', Password);

  try {
    // Buscar al usuario por su correo electrónico
    const user = await findUserByEmail(Email);
    console.log('Usuario encontrado:', user);

    // Verificar si el usuario existe
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si la contraseña proporcionada es válida
    if (!Password || !user.password) {  // Asegúrate de usar `user.password` (en minúsculas)
      res.status(400).json({ error: 'Contraseña no válida' });
      return;
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(Password, user.password); // Asegúrate de usar `user.password`
    if (!isMatch) {
      res.status(401).json({ error: 'Contraseña incorrecta' });
      return;
    }

    // Responder con éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        UsuarioID: user.usuarioid,
        Nombre: user.nombre,
        Apellido: user.apellido,
        Email: user.email,
        Rol: user.rol,
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
    const result = await pool.query(
      "SELECT public.sp_registerbeneficiario($1, $2, $3, $4, $5, $6)",
      [Nombre, Apellido, Email, hashedPassword, DNI, Telefono]
    );


    console.log("Beneficiario creado exitosamente");

    res.status(201).json({
      message: "Beneficiario creado exitosamente",
      result: result.rows[0]
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
    const { rows }: any = await pool.query("SELECT rol FROM usuario WHERE usuarioID = $1", [UsuarioID]);

    // Verificar si el usuario existe
    if (rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const user = rows[0]; // Asumiendo que rows[0] contiene el objeto del usuario
    console.log(user.rol);

    // Enviar el rol del usuario como respuesta
    res.status(200).json({ role: user.rol });
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    next(error);
  }
};
export const checkIfNewBeneficiario = async (req: Request, res: Response) => {
  const { BeneficiarioID } = req.params;
  console.log(BeneficiarioID);
  try {
    // Verificar si el beneficiario tiene alguna póliza activa
    const { rows }: any = await pool.query(
      `SELECT COUNT(*) AS count
       FROM poliza
       INNER JOIN beneficiario ON beneficiario.BeneficiarioID = poliza.BeneficiarioID
       WHERE beneficiario.UsuarioID = $1`, 
      [BeneficiarioID]
    );

    // Comprobar si el conteo es 0, indicando que no tiene pólizas activas
    if (parseInt(rows[0].count, 10) === 0) {
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


// Controlador para eliminar un beneficiario
export const deleteBeneficiario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Eliminar las pólizas asociadas al beneficiario
    await pool.query("DELETE FROM poliza WHERE beneficiarioid = $1", [id]);

    // Eliminar los registros de siniestros que hacen referencia al BeneficiarioID
    await pool.query("DELETE FROM siniestros WHERE beneficiarioid = $1", [id]);

    // Eliminar el beneficiario
    const { rowCount } = await pool.query("DELETE FROM beneficiario WHERE beneficiarioid = $1", [id]);

    if (rowCount === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({ message: "Beneficiario y sus registros asociados eliminados exitosamente." });
  } catch (error) {
    console.error("Error al eliminar beneficiario:", error);
    next(error);
  }
};

// Controlador para actualizar un beneficiario
export const updateBeneficiario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Validar los datos de entrada con el esquema
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { nombre, apellido, dni, email, telefono, password, usuarioid } = req.body;
    console.log("Datos a actualizar:", req.body);

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const id_beneficiario = parseInt(id, 10);

    // Realizar la actualización directamente en la tabla beneficiario
    const { rowCount } = await pool.query(
      `UPDATE beneficiario
       SET nombre = $1, apellido = $2, dni = $3, email = $4, telefono = $5
       WHERE beneficiarioid= $6`,
      [nombre, apellido, dni, email, telefono, id_beneficiario]
    );

    // Si se proporcionó una nueva contraseña, actualizarla en la tabla Usuario
    if (password) {
      await pool.query(
        `UPDATE usuario
         SET password = $1
         WHERE usuarioid = (SELECT usuarioid FROM beneficiario WHERE beneficiarioid = $2)`,
        [hashedPassword, id_beneficiario]
      );
    }

    // Verificar si la fila fue afectada (actualizada)
    if (rowCount === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    res.status(200).json({ message: "Beneficiario actualizado exitosamente" });

  } catch (error) {
    console.error("Error al actualizar beneficiario:", error);
    next(error);
  }
};


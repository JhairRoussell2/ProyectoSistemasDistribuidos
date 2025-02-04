import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt'; 
import { findUserByEmail, findUserByEmail2 ,createUser,  savePasswordResetToken 
  , findPasswordResetToken, updateUserPassword , deletePasswordResetToken
} from "../models/userModel";

import crypto from "crypto";
import nodemailer from "nodemailer";
// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  const { Nombre, Apellido, Email, Password, Rol } = req.body;
  try {
    // Verificamos si el email ya está en uso
    const userExists = await findUserByEmail(Email);
    if (userExists) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      return;
    }

    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Crear el usuario en la base de datos
    await createUser({ Nombre, Apellido, Email, Password: hashedPassword, Rol });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { Email, Password } = req.body;

  try {
    const user = await findUserByEmail(Email);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      res.status(401).json({ error: 'Contraseña incorrecta' });
      return;
    }

    // Generar token JWT para la sesión del usuario
    const token = generateToken({ UsuarioID: user.UsuarioID, Rol: user.Rol });

    // Responder con éxito y enviar el token junto con los datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
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
  
export const recuperarContraseña = async (req: Request, res: Response): Promise<void> => {
  const { Email } = req.body;
  
  try {
    const user2 = await findUserByEmail2(Email);
    console.log("✅ Usuario encontrado:", user2);

    if (!user2 || !user2.usuarioid) { // Cambia user.UsuarioID a user.usuarioid
      res.status(404).json({ error: "El correo no está registrado." });
      return;
    }

    const usuarioid = user2.usuarioid; // Cambia user.UsuarioID a user.usuarioid

    // 🔹 2️⃣ Generar un token único y definir su expiración (1 hora)
    const token = crypto.randomBytes(32).toString("hex"); 
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 🔹 3️⃣ Guardar el token en la base de datos
    await savePasswordResetToken(usuarioid, token, expiresAt);

    // 🔹 4️⃣ Configurar `nodemailer`
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zavaletaryan.18@gmail.com", 
        pass: "lhox fhue lgcd dxpk",
      },
    });

    // 🔹 5️⃣ Enviar el correo con el enlace de recuperación
    const resetLink = `http://localhost:5173/reset/${token}`;
    await transporter.sendMail({
      to: Email,
      subject: "Recuperación de Contraseña - SegurosFlex",
      html: `
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace es válido por 1 hora.</p>
      `,
    });

    res.json({ message: "Correo enviado. Revisa tu bandeja de entrada." });

  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // 1️⃣ Buscar el token en la BD
    const resetTokenData = await findPasswordResetToken(token);
    if (!resetTokenData) {
      res.status(400).json({ error: "Token inválido o expirado." });
      return;
    }

    const usuarioid = resetTokenData.usuarioid;

    // 2️⃣ Actualizar la contraseña del usuario
    await updateUserPassword(usuarioid, newPassword);

    // 3️⃣ Eliminar el token después de usarlo
    await deletePasswordResetToken(token);

    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};
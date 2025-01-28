import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt'; 
import { findUserByEmail, createUser } from '../models/userModel';

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  const { Nombre, Apellido, Email, Password, Rol } = req.body;
  const hashedPassword = await bcrypt.hash(Password, 10);

  try {
    await createUser({ Nombre, Apellido, Email, Password: hashedPassword, Rol });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Inicio de sesión
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
  

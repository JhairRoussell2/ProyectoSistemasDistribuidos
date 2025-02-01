import pool from '../config/db';

// Definimos la interfaz para el usuario
export interface User {
  UsuarioID?: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Password: string;
  Rol: 'Personal' | 'Administrador' | 'Beneficiario';
}

// Función para buscar un usuario por su correo electrónico
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { rows } = await pool.query(
      'SELECT UsuarioID, Nombre, Apellido, Email, Password, Rol FROM usuario WHERE Email = $1 LIMIT 1',
      [email]
    );

    // Si no se encuentra el usuario, retornamos null
    if (rows.length === 0) {
      return null;
    }

    // Retornamos el primer resultado encontrado
    return rows[0];
  } catch (error) {
    console.error('Error al ejecutar findUserByEmail:', error);
    throw new Error('Error en la base de datos');
  }
};

// Función para crear un usuario
export const createUser = async (user: User): Promise<void> => {
  try {
    // Llamada al procedimiento almacenado para crear el usuario
    await pool.query(
      'INSERT INTO usuario (Nombre, Apellido, Email, Password, Rol) VALUES ($1, $2, $3, $4, $5)',
      [user.Nombre, user.Apellido, user.Email, user.Password, user.Rol]
    );
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw new Error('Error en la base de datos');
  }
};

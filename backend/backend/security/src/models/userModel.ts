import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

// Definimos la interfaz para el usuario
export interface User {
  UsuarioID?: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Password: string;
  Rol: 'Personal' | 'Administrador' | 'Beneficiario';
}

// Función para llamar al procedimiento almacenado
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await pool.query<(User & RowDataPacket)[]>(
      'CALL sp_FindUserByEmail(?)', 
      [email]
    );

    // En MySQL, los procedimientos almacenados devuelven un array de arrays, por lo que accedemos a `rows[0]`
    if (rows.length > 0 && rows[0].length > 0) {
      return rows[0][0]; // Retorna el primer usuario encontrado
    }
    return null;
  } catch (error) {
    console.error('Error al ejecutar sp_FindUserByEmail:', error);
    throw new Error('Error en la base de datos');
  }
};
export const createUser = async (user: User): Promise<void> => {
  try {
    await pool.query(
      'CALL sp_CreateUser(?, ?, ?, ?, ?)',
      [user.Nombre, user.Apellido, user.Email, user.Password, user.Rol]
    );
  } catch (error) {
    console.error('Error al ejecutar sp_CreateUser:', error);
    throw new Error('Error en la base de datos');
  }
}

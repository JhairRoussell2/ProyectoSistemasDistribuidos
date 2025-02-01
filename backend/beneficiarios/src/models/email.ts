import pool from '../config/db';  // Asegúrate de tener correctamente configurada la conexión a la base de datos.

export const findUserByEmail = async (email: string): Promise<any | null> => {
  try {
    // Ejecuta la función creada en PostgreSQL para obtener el usuario por su correo electrónico
    const { rows } = await pool.query('SELECT * FROM public.sp_finduserbyemail($1)', [email]);

    // Si se encontró el usuario, retornarlo, de lo contrario retornar null
    if (rows.length > 0) {
      // Verifica si el campo 'Password' está presente en el objeto antes de devolverlo
      console.log(rows[0]); // Para ver todos los campos devueltos
      return rows[0];  // Retorna el primer usuario encontrado
    }
    return null;  // Si no se encuentra el usuario, retorna null
  } catch (error) {
    console.error('Error al ejecutar la función sp_finduserbyemail:', error);
    throw new Error('Error en la base de datos');
  }
};


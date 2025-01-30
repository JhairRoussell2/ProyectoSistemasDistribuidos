import pool from '../config/db';  // Asegúrate de tener correctamente configurada la conexión a la base de datos.

export const findUserByEmail = async (email: string): Promise<any | null> => {
  try {
    // Ejecuta el procedimiento almacenado para obtener el usuario
    const [rows] : any = await pool.query('CALL sp_FindUserByEmail(?)', [email]);

    // Accede al primer resultado de la consulta
    if (rows.length > 0 && rows[0].length > 0) {
      return rows[0][0];  // Retorna el primer usuario encontrado
    }
    return null;  // Si no se encuentra el usuario, retorna null
  } catch (error) {
    console.error('Error al ejecutar sp_FindUserByEmail:', error);
    throw new Error('Error en la base de datos');
  }
};

import pool from "../config/db";

class PolizaModel {
  // Crear una póliza
  async createPoliza(
    BeneficiarioID: number,
    TipoPoliza: string
  ): Promise<any> {
    try {
      // Determinar la fecha de inicio (hoy)
      const FechaInicio = new Date().toISOString().split("T")[0]; // Fecha de hoy (YYYY-MM-DD)
      
      // Determinar la fecha de fin (plazo de 1 año)
      const fechaFin = new Date();
      fechaFin.setFullYear(fechaFin.getFullYear() + 1); // Sumar 1 año
      const FechaFin = fechaFin.toISOString().split("T")[0]; // Fecha dentro de 1 año (YYYY-MM-DD)

      // Crear la póliza en la base de datos
      const { rows } = await pool.query(
        "INSERT INTO poliza (beneficiarioid, tipopoliza, fechainicio, fechaFin) VALUES ($1, $2, $3, $4) RETURNING polizaid",
        [BeneficiarioID, TipoPoliza, FechaInicio, FechaFin]
      );
      return rows[0]; // Retorna el resultado de la inserción (PolizaID)
    } catch (error) {
      throw new Error(`Error al crear la póliza: ${(error as any).message}`);
    }
  }

  // Obtener todas las pólizas
  async getPolizas(): Promise<any> {
    try {
      const { rows } = await pool.query("SELECT * FROM poliza");
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener pólizas: ${(error as any).message}`);
    }
  }

  // Obtener pólizas de un beneficiario por su DNI
  async getPolizasByDNI(DNI: string): Promise<any> {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM poliza WHERE beneficiarioid IN (SELECT beneficiarioid FROM beneficiario WHERE dni = $1)`,
        [DNI]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener pólizas por DNI: ${(error as any).message}`);
    }
  }

  // Obtener una póliza específica por ID
  async getPolizaByID(polizaID: number): Promise<any> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM poliza WHERE polizaid = $1",
        [polizaID]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener la póliza: ${(error as any).message}`);
    }
  }

  // Actualizar el estado de una póliza
  async updatePolizaEstado(polizaID: number, estado: string): Promise<any> {
    try {
      const { rowCount } = await pool.query(
        "UPDATE poliza SET estado = $1 WHERE polizaid = $2",
        [estado, polizaID]
      );
      if (rowCount === 0) {
        throw new Error("No se encontró la póliza para actualizar");
      }
      return { message: "Estado de la póliza actualizado exitosamente." };
    } catch (error) {
      throw new Error(`Error al actualizar la póliza: ${(error as any).message}`);
    }
  }
}

export default new PolizaModel();

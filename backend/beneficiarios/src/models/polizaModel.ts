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
      const [result] = await pool.query(
        "INSERT INTO poliza (BeneficiarioID, TipoPoliza, FechaInicio, FechaFin) VALUES (?, ?, ?, ?)",
        [BeneficiarioID, TipoPoliza, FechaInicio, FechaFin]
      );
      return result;
    } catch (error) {
      throw new Error(`Error al crear la póliza: ${(error as any).message}`);
    }
  }

  // Obtener todas las pólizas
  async getPolizas(): Promise<any> {
    try {
      const [result] = await pool.query("SELECT * FROM poliza");
      return result;
    } catch (error) {
      throw new Error(`Error al obtener pólizas: ${(error as any).message}`);
    }
  }

  // Obtener pólizas de un beneficiario por su DNI
  async getPolizasByDNI(DNI: string): Promise<any> {
    try {
      const [result] = await pool.query(
        `SELECT * FROM poliza WHERE BeneficiarioID IN (SELECT BeneficiarioID FROM beneficiario WHERE DNI = ?)`,
        [DNI]
      );
      return result;
    } catch (error) {
      throw new Error(`Error al obtener pólizas por DNI: ${(error as any).message}`);
    }
  }

  // Obtener una póliza específica por ID
  async getPolizaByID(polizaID: number): Promise<any> {
    try {
      const [result] = await pool.query(
        "SELECT * FROM poliza WHERE PolizaID = ?",
        [polizaID]
      );
      return result;
    } catch (error) {
      throw new Error(`Error al obtener la póliza: ${(error as any).message}`);
    }
  }
  async updatePolizaEstado(polizaID: number, estado: string): Promise<any> {
    try {
      const [result] = await pool.query(
        "UPDATE poliza SET Estado = ? WHERE PolizaID = ?",
        [estado, polizaID]
      );
      return result;
    } catch (error) {
      throw new Error(`Error al actualizar la póliza: ${(error as any).message}`);
    }
  }
}

export default new PolizaModel();

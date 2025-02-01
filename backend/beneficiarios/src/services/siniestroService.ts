import pool from "../config/db";

class SiniestroService {

  // Obtener BeneficiarioID desde usuarioID
  async obtenerBeneficiarioID(usuarioID: number) {
    const { rows } = await pool.query(
      "SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioID]
    );
    if (rows.length === 0) {
      throw new Error("Beneficiario no encontrado");
    }
    return rows[0].beneficiarioid;
  }

  // Obtener PolizaID desde BeneficiarioID
  async obtenerPolizaID(beneficiarioID: number) {
    const { rows } = await pool.query(
      "SELECT polizaid FROM poliza WHERE beneficiarioid = $1", [beneficiarioID]
    );
    if (rows.length === 0) {
      throw new Error("Póliza no encontrada");
    }
    return rows[0].polizaid;
  }

  // Registrar el siniestro en la base de datos
  async registrarSiniestro(
    beneficiarioID: number,
    polizaID: number,
    tipoSiniestro: string,
    fechaSiniestro: string,
    departamento: string,
    distrito: string,
    provincia: string,
    ubicacion: string,
    descripcion: string,
    documentosJson: string
  ) {
    const { rows } = await pool.query(
      `INSERT INTO siniestros 
      (beneficiarioid, polizaid, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING siniestroid`,
      [
        beneficiarioID,
        polizaID,
        tipoSiniestro,
        fechaSiniestro,
        departamento,
        distrito,
        provincia,
        ubicacion,
        descripcion,
        documentosJson,
      ]
    );
    return rows[0].siniestroid;
  }

  // Listar todos los siniestros
  async listarSiniestros() {
    const { rows } = await pool.query("SELECT * FROM siniestros");
    return rows;
  }
}

export default new SiniestroService();

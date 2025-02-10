import pool from "../config/db";
import nodemailer from "nodemailer";

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
  async obtenerPolizaID(beneficiarioID: number): Promise<{ polizaID: number; estado: string }> {
    try {
        const { rows } = await pool.query(
            "SELECT polizaid, estado FROM poliza WHERE beneficiarioid = $1",
            [beneficiarioID]
        );

        if (rows.length === 0) {
            throw new Error("Póliza no encontrada");
        }
        if (rows[0].estado !== "Activa") {
            throw new Error("La póliza no ha sido activada");
        }

        return { polizaID: rows[0].polizaid, estado: rows[0].estado };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error en obtenerPolizaID:", error.message);
        } else {
            console.error("Error en obtenerPolizaID:", error);
        }
        throw error; // Relanzamos el error para ser manejado en la llamada `await`
    }
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

  async obtenerDatosBeneficiario(siniestroID: number) {
    const { rows } = await pool.query(
      `SELECT b.email, b.nombre, b.apellido, t.nombre AS taller_nombre, t.direccion AS taller_direccion, t.telefono AS taller_telefono 
       FROM siniestros s
       JOIN beneficiario b ON s.beneficiarioid = b.beneficiarioid
       JOIN taller t ON s.tallerid = t.tallerid
       WHERE s.siniestroid = $1`, 
      [siniestroID]
    );

    if (rows.length === 0) {
      throw new Error("Beneficiario o taller no encontrados para este siniestro");
    }
    
    return rows[0]; // Retorna el beneficiario y los detalles del taller
  }

  // Asignar un taller a un siniestro y enviar correo de confirmación
  async asignarTallerASiniestro(siniestroID: number, tallerID: number) {
    // Obtener el taller anterior del siniestro
    const { rows } = await pool.query(
      "SELECT tallerid FROM siniestros WHERE siniestroid = $1",
      [siniestroID]
    );
    const tallerPrevio = rows[0]?.tallerid; // Puede ser null si nunca tuvo un taller

    // Actualizar el siniestro con el nuevo taller
    await pool.query(
      "UPDATE siniestros SET tallerid = $1 WHERE siniestroid = $2",
      [tallerID, siniestroID]
    );

    // Obtener datos del beneficiario y del nuevo taller asignado
    const datosBeneficiario = await this.obtenerDatosBeneficiario(siniestroID);

    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zavaletaryan.18@gmail.com",
        pass: "lhox fhue lgcd dxpk",
      },
    });

    // Definir mensaje según si el taller fue asignado por primera vez o cambiado
    const mensajeInicio = tallerPrevio
      ? `Se le informa que el taller asignado a su siniestro ha sido cambiado. Ahora ha sido reasignado al siguiente taller:`
      : `Se le informa que su siniestro ha sido asignado al siguiente taller:`;

    // Contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: datosBeneficiario.email,
      subject: tallerPrevio
        ? "🔄 Cambio de Taller - SegurosFlex"
        : "📢 Asignación de Taller - SegurosFlex",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: auto;">
            
            <!-- Logo -->
            <div style="text-align: center; font-size: 24px; font-weight: bold; color: #ff4d4d; margin-bottom: 10px;">
              🚗 SeguroFlex
            </div>

            <h3 style="color: #333; text-align: center;">Estimado/a ${datosBeneficiario.nombre} ${datosBeneficiario.apellido},</h3>
            
            <p style="color: #555; font-size: 16px;">
              ${mensajeInicio}
            </p>

            <!-- Información en tarjeta -->
            <div style="background-color: #eaf6ff; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>🏢 Taller:</strong> ${datosBeneficiario.taller_nombre}</p>
              <p><strong>📍 Dirección:</strong> ${datosBeneficiario.taller_direccion}</p>
              <p><strong>📞 Teléfono:</strong> ${datosBeneficiario.taller_telefono}</p>
            </div>

            <p style="color: #555;">Si tiene alguna consulta, no dude en comunicarse con nosotros.</p>

            <!-- Botón de contacto -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:5173/" 
                style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                🏠 Ir a la página
              </a>
            </div>

            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 20px;">
              Atentamente,<br>
              <strong style="color: #ff4d4d;">SeguroFlex</strong>
            </p>
          </div>
        </div>
      `,
    };
    
    // Enviar correo
    await transporter.sendMail(mailOptions);
  }

}




export default new SiniestroService();
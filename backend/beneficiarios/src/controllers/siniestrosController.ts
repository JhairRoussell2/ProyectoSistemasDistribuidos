import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import pool from "../config/db";
import { send } from "process";

// Esquema de validación
const schema = Joi.object({
  tipoSiniestro: Joi.string().required(),
  fechaSiniestro: Joi.date().required(),
  departamento: Joi.string().required(),
  distrito: Joi.string().required(),
  provincia: Joi.string().required(),
  ubicacion: Joi.string().required(),
  descripcion: Joi.string().required(),
  documentos: Joi.array().items(Joi.string().uri()).optional(),  // Asegúrate de permitir un array de URLs
  usuarioID: Joi.number().required(), // Para obtener el BeneficiarioID relacionado
});

// Controlador para registrar un siniestro
export const registrarSiniestro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Solicitud recibida:', req.body);

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const {
      tipoSiniestro,
      fechaSiniestro,
      departamento,
      distrito,
      provincia,
      ubicacion,
      descripcion,
      documentos = [],
      usuarioID,
    } = req.body;

    console.log({
      tipoSiniestro,
      fechaSiniestro,
      departamento,
      distrito,
      provincia,
      ubicacion,
      descripcion,
      documentos,
      usuarioID,
    });

    // Obtener BeneficiarioID y PolizaID desde usuarioID
    const { rows: beneficiarioRows } = await pool.query(
      "SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1", [usuarioID]
    );

    if (beneficiarioRows.length === 0) {
      res.status(404).json({ error: "Beneficiario no encontrado." });
      return;
    }
    const BeneficiarioID = beneficiarioRows[0].beneficiarioid;
    console.log("BeneficiarioID:", BeneficiarioID);

    const { rows: polizaRows } = await pool.query(
      "SELECT polizaid FROM poliza WHERE beneficiarioid = $1", [BeneficiarioID]
    );

    if (polizaRows.length === 0) {
      res.status(404).json({ error: "Póliza no encontrada." });
      return;
    }
    const PolizaID = polizaRows[0].polizaid;

    // Verificar si los documentos están en el formato correcto (si existen)
    let documentosUrls: string[] = [];

    if (documentos.length > 0) {
      for (let i = 0; i < documentos.length; i++) {
        const isValidUrl = Joi.string().uri().validate(documentos[i]);
        if (isValidUrl.error) {
          res.status(400).json({ error: `El documento en la posición ${i + 1} no es una URL válida` });
          return;
        }
        documentosUrls.push(documentos[i]);
      }
    }

    // Convertir los documentos a JSON válido
    const documentosJson = JSON.stringify(documentosUrls);

    // Llamada a la consulta INSERT directamente en la tabla 'siniestros' con RETURNING
    const result = await pool.query(
      `INSERT INTO siniestros 
      (beneficiarioid, polizaid, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING siniestroid`,  // Usar RETURNING para obtener el siniestroid
      [
        BeneficiarioID,            // BeneficiarioID obtenido
        PolizaID,                  // PolizaID obtenido
        tipoSiniestro,             // Tipo de Siniestro
        fechaSiniestro,            // Fecha del Siniestro
        departamento,              // Departamento
        distrito,                  // Distrito
        provincia,                 // Provincia
        ubicacion,                 // Ubicación
        descripcion,               // Descripción
        documentosJson,            // Documentos en formato JSON
      ]
    );

    // Verificar que la consulta INSERT devolvió el siniestroid
    const siniestroId = result.rows[0].siniestroid;
    if (!siniestroId) {
      res.status(500).json({ error: "No se pudo obtener el ID del siniestro." });
      return;
    }

    // Responder con el ID del siniestro insertado
    res.status(201).json({
      message: "Siniestro registrado con éxito",
      siniestroId,  // Retorna el ID del siniestro recién creado
    });
  } catch (error) {
    console.error("Error al registrar siniestro:", error);
    next(error);
  }
};

export const listarSiniestros = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [result]: any = await pool.query("SELECT * FROM siniestros");

    // Si no hay resultados
    if (result.length === 0) {
      res.status(404).json({ message: "No se encontraron siniestros." });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al listar siniestros:", error);
    next(error);
  }
};

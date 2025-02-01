import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import pool from "../config/db";
import multer from 'multer';  // Asegúrate de tener multer instalado
import cloudinary from "cloudinary";

// Configurar multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("documentos", 5); // Ajusta el número máximo de archivos según lo necesites

// Esquema de validación
const schema = Joi.object({
  BeneficiarioID: Joi.number().required(),  // Asegúrate de permitir este campo
  PolizaID: Joi.number().required(),
  tipoSiniestro: Joi.string().required(),
  fechaSiniestro: Joi.date().required(),
  departamento: Joi.string().required(),
  distrito: Joi.string().required(),
  provincia: Joi.string().required(),
  ubicacion: Joi.string().required(),
  descripcion: Joi.string().required(),
  documentos: Joi.array().items(Joi.string().uri()).optional(),  // Asegúrate de permitir un array de URLs
});


// Controlador para registrar un siniestro
export const registrarSiniestro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Solicitud recibida:', req.body); // Imprimir el cuerpo de la solicitud

    // Validar los datos enviados
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
      BeneficiarioID,
      PolizaID,
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
      BeneficiarioID,
      PolizaID,
    });

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

    // Llamada a la consulta INSERT directamente en la tabla 'siniestros'
    const [result]: any = await pool.query(
      `INSERT INTO siniestros 
      (BeneficiarioID, PolizaID, tipo_siniestro, fecha_siniestro, departamento, distrito, provincia, ubicacion, descripcion, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        BeneficiarioID,            // BeneficiarioID
        PolizaID,                  // PolizaID
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

    // Responder con el ID del siniestro insertado
    res.status(201).json({
      message: "Siniestro registrado con éxito",
      siniestroId: result.insertId, // Retorna el ID del siniestro recién creado
    });
  } catch (error) {
    console.error("Error al registrar siniestro:", error);
    next(error);
  }
};






// Controlador para listar todos los siniestros
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

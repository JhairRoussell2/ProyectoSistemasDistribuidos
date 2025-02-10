import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import SiniestroService from "../services/siniestroService";

// Esquema de validación para el cuerpo de la solicitud
const schema = Joi.object({
  tipoSiniestro: Joi.string().required(),
  fechaSiniestro: Joi.date().required(),
  departamento: Joi.string().required(),
  distrito: Joi.string().required(),
  provincia: Joi.string().required(),
  ubicacion: Joi.string().required(),
  descripcion: Joi.string().required(),
  documentos: Joi.array().items(Joi.string().uri()).optional(),
  usuarioID: Joi.number().required(),
});

export const registrarSiniestro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validar la solicitud
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

    // Obtener BeneficiarioID y PolizaID desde usuarioID
    const beneficiarioID = await SiniestroService.obtenerBeneficiarioID(usuarioID);
    let polizaID: number | null = null;
    let estado: string | null = null;

    try {
      const polizaData = await SiniestroService.obtenerPolizaID(beneficiarioID);
      polizaID = polizaData.polizaID;
      estado = polizaData.estado;
      console.log("Póliza obtenida:", polizaID, "Estado:", estado);
    } catch (error) {
      console.error("Error al obtener la póliza:", (error as Error).message);
      res.status(400).json({ error: "No se pudo obtener la póliza del beneficiario" });
      return; // Detiene la ejecución si no se encuentra la póliza
    }

    // Verificar y procesar los documentos
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
    const documentosJson = JSON.stringify(documentosUrls);

    // Registrar el siniestro
    const siniestroId = await SiniestroService.registrarSiniestro(
      beneficiarioID,
      polizaID,
      tipoSiniestro,
      fechaSiniestro,
      departamento,
      distrito,
      provincia,
      ubicacion,
      descripcion,
      documentosJson
    );

    // Responder con el ID del siniestro registrado
    res.status(201).json({ message: "Siniestro registrado con éxito", siniestroId });
  } catch (error) {
    console.error("Error al registrar siniestro:", error);
    next(error);
  }
};

export const listarSiniestros = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const siniestros = await SiniestroService.listarSiniestros();
    if (siniestros.length === 0) {
      res.status(404).json({ message: "No se encontraron siniestros." });
      return;
    }
    res.status(200).json(siniestros);
  } catch (error) {
    console.error("Error al listar siniestros:", error);
    next(error);
  }
};

export const asignarTaller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { siniestroid, tallerid } = req.body;
    console.log("Siniestroid:", siniestroid);
    console.log("tallerID", tallerid);
    if (!siniestroid || !tallerid) {
      res.status(400).json({ error: "Faltan datos requeridos (siniestroID o tallerID)" });
      return;
    }
    await SiniestroService.asignarTallerASiniestro(siniestroid, tallerid);
    res.status(200).json({ message: "Taller asignado y correo enviado con éxito." });
  } catch (error) {
    console.error("Error al asignar taller:", error);
    next(error);
  }
};

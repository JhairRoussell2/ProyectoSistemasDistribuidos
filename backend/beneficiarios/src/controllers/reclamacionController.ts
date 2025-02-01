import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import pool from "../config/db";
import multer from "multer";

// Configurar multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("documentos", 5);

// **📌 Esquema de Validación con Joi**
const schema = Joi.object({
  UsuarioID: Joi.number().required(), // Se espera que el frontend envíe el UsuarioID
  SiniestroID: Joi.number().required(),
  estado: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  tipo: Joi.string().max(50).required(),
  documentos: Joi.array().items(Joi.string().uri()).optional(), // Lista de URLs de documentos
});

// **1️⃣ Obtener los siniestros asociados al beneficiario autenticado**
export const obtenerSiniestrosBeneficiario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarioID = req.body.UsuarioID || req.params.UsuarioID; // Se recibe UsuarioID en la petición

    if (!usuarioID) {
      res.status(400).json({ message: "UsuarioID es requerido." });
      return;
    }

    // 🔹 Buscar el BeneficiarioID a partir del UsuarioID
    const [beneficiario]: any = await pool.query(
      "SELECT BeneficiarioID FROM beneficiario WHERE UsuarioID = ?",
      [usuarioID]
    );

    if (beneficiario.length === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    const beneficiarioID = beneficiario[0].BeneficiarioID;

    // 🔹 Obtener los siniestros asociados al beneficiario
    const [siniestros]: any = await pool.query(
      "SELECT * FROM siniestros WHERE BeneficiarioID = ?",
      [beneficiarioID]
    );

    if (siniestros.length === 0) {
      res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
      return;
    }

    res.status(200).json(siniestros);
  } catch (error) {
    console.error("Error al obtener siniestros:", error);
    next(error);
  }
};

export const registrarReclamacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Datos recibidos en POST /api/reclamaciones:", req.body); // ✅ Agregar este log
  
      // **Validar los datos con Joi**
      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }
  
      const { UsuarioID, SiniestroID, estado, descripcion, tipo } = req.body;
  
      const [result]: any = await pool.query(
        `INSERT INTO Reclamacion (SiniestroID, estado, descripcion, tipo) VALUES (?, ?, ?, ?)`,
        [SiniestroID, estado, descripcion, tipo]
      );
  
      res.status(201).json({
        message: "Reclamación registrada con éxito",
        ReclamacionID: result.insertId,
      });
    } catch (error) {
      console.error("Error al registrar reclamación:", error);
      next(error);
    }
  };
  
// **3️⃣ Subir documentos de reclamación**
export const subirDocumentoReclamacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ReclamacionID } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No se han subido archivos" });
      return;
    }

    const documentosInsert = files.map(file => [ReclamacionID, file.originalname, file.mimetype, file.path]);

    await pool.query(
      `INSERT INTO DocumentosReclamacion (ReclamacionID, Nombre, Extension, Url) VALUES ?`,
      [documentosInsert]
    );

    res.status(201).json({ message: "Documentos subidos con éxito" });
  } catch (error) {
    console.error("Error al subir documentos:", error);
    next(error);
  }
};

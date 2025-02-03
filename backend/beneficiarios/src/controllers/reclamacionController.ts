import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import pool from "../config/db";
import cloudinary from "cloudinary";
import multer from "multer";

// 📌 **Configurar Cloudinary**
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 📌 **Configurar Multer para manejar archivos en memoria**
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("documentos", 5); // Se permite un máximo de 5 archivos

// 📌 **Esquema de Validación con Joi**
const schema = Joi.object({
  siniestroid: Joi.number().required(),
  estado: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  tipo: Joi.string().max(50).required(),
});

// 📌 **Registrar una nueva reclamación con documentos**
export const registrarReclamacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error al procesar archivos con Multer." });
    }

    const client = await pool.connect(); // 📌 Iniciar una transacción

    try {
      console.log("📌 Recibiendo datos:", req.body);

      // **Validar los datos con Joi**
      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { siniestroid, estado, descripcion, tipo } = req.body;

      // 🔹 **Verificar si el siniestro existe**
      const { rowCount: siniestroExists } = await pool.query(
        "SELECT * FROM siniestros WHERE siniestroid = $1",
        [siniestroid]
      );
      if (siniestroExists === 0) {
        res.status(404).json({ message: "Siniestro no encontrado." });
        return;
      }

      // 📌 **Iniciar la transacción**
      await client.query("BEGIN");

      // 🔹 **Insertar la reclamación**
      const { rows: reclamacionRows } = await client.query(
        `INSERT INTO reclamacion (siniestroid, estado, descripcion, tipo) VALUES ($1, $2, $3, $4) RETURNING reclamacionid`,
        [siniestroid, estado, descripcion, tipo]
      );

      const reclamacionid = reclamacionRows[0].reclamacionid;
      console.log("📌 Reclamación creada con ID:", reclamacionid);

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        await client.query("ROLLBACK");
        res.status(400).json({ message: "Debe subir al menos un documento." });
        return;
      }

      let documentosInsert: any[] = [];

      // 📌 **Subir archivos a Cloudinary y registrar en la BD**
      for (const file of req.files as Express.Multer.File[]) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "Reclamaciones" },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        if (!result) {
          await client.query("ROLLBACK");
          return res.status(500).json({ message: "Error al subir documentos a Cloudinary" });
        }

        const extension = file.originalname.split(".").pop() || "desconocido";
        documentosInsert.push([reclamacionid, file.originalname, extension, (result as any).secure_url]);

        // 📌 **Insertar documentos en la base de datos**
        await client.query(
          `INSERT INTO documentosreclamacion (reclamacionid, nombre, extension, url, fecha_subida)
          VALUES ($1, $2, $3, $4, NOW())`,
          [reclamacionid, file.originalname, extension, (result as any).secure_url]
        );
      }

      await client.query("COMMIT"); // 📌 **Confirmar transacción**
      res.status(201).json({ message: "Reclamación y documentos subidos con éxito.", reclamacionid });

    } catch (error) {
      await client.query("ROLLBACK"); // 📌 **Revertir en caso de error**
      console.error("❌ Error al registrar reclamación con documentos:", error);
      next(error);
    } finally {
      client.release();
    }
  });
};

// 📌 **Obtener las reclamaciones de un usuario**
export const obtenerReclamacionesPorUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { usuarioid } = req.params;

    if (!usuarioid) {
      res.status(400).json({ message: "UsuarioID es requerido." });
      return;
    }

    // 🔹 **Obtener el beneficiario asociado al usuario**
    const { rows: beneficiarioRows } = await pool.query(
      "SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1",
      [usuarioid]
    );

    if (beneficiarioRows.length === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    const beneficiarioid = beneficiarioRows[0].beneficiarioid;

    // 🔹 **Obtener las reclamaciones asociadas al beneficiario**
    const { rows: reclamaciones } = await pool.query(
      `SELECT r.*, json_agg(d.*) AS documentos
       FROM reclamacion r
       LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
       WHERE r.siniestroid IN (SELECT siniestroid FROM siniestros WHERE beneficiarioid = $1)
       GROUP BY r.reclamacionid`,
      [beneficiarioid]
    );

    if (reclamaciones.length === 0) {
      res.status(404).json({ message: "No se encontraron reclamaciones para este usuario." });
      return;
    }

    res.status(200).json(reclamaciones);
  } catch (error) {
    console.error("Error al obtener reclamaciones:", error);
    next(error);
  }
};

// 📌 **Obtener siniestros de un beneficiario**
export const obtenerSiniestrosBeneficiario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Parámetros recibidos:", req.params); // ✅ Imprimir los parámetros recibidos

    const { usuarioid } = req.params; 

    if (!usuarioid) {
      res.status(400).json({ message: "UsuarioID es requerido." });
      return;
    }

    // 🔹 Buscar el BeneficiarioID desde el usuarioID
    const { rows: beneficiarioRows } = await pool.query(
      "SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1",
      [usuarioid]
    );

    if (beneficiarioRows.length === 0) {
      res.status(404).json({ message: "Beneficiario no encontrado." });
      return;
    }

    const beneficiarioid = beneficiarioRows[0].beneficiarioid;

    // 🔹 Obtener los siniestros del beneficiario
    const { rows: siniestros } = await pool.query(
      "SELECT * FROM siniestros WHERE beneficiarioid = $1",
      [beneficiarioid]
    );

    if (siniestros.length === 0) {
      res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
      return;
    }

    res.status(200).json(siniestros);
  } catch (error) {
    console.error("❌ Error al obtener siniestros del beneficiario:", error);
    next(error);
  }
};

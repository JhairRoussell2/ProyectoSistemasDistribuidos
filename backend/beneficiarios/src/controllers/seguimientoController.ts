// controllers/seguimientoController.ts

import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

// 📌 **Obtener siniestros de un beneficiario**
export const obtenerSiniestrosBeneficiario = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const { usuarioid } = req.params;

    console.log('UsuarioID recibido:', usuarioid); // Log para verificar el usuarioid

    if (!usuarioid) {
      return res.status(400).json({ message: "UsuarioID es requerido." });
    }

    const { rows: beneficiarioRows } = await pool.query(
      "SELECT beneficiarioid FROM beneficiario WHERE usuarioid = $1",
      [usuarioid]
    );

    console.log('Beneficiario encontrado:', beneficiarioRows); // Log para verificar el beneficiario encontrado

    if (beneficiarioRows.length === 0) {
      return res.status(404).json({ message: "Beneficiario no encontrado." });
    }

    const beneficiarioid = beneficiarioRows[0].beneficiarioid;

    const { rows: siniestros } = await pool.query(
      "SELECT * FROM siniestros WHERE beneficiarioid = $1",
      [beneficiarioid]
    );

    console.log('Siniestros encontrados para el beneficiario:', siniestros); // Log para verificar los siniestros encontrados

    if (siniestros.length === 0) {
      return res.status(404).json({ message: "No se encontraron siniestros para este beneficiario." });
    }

    return res.status(200).json(siniestros);
  } catch (error) {
    console.error("❌ Error al obtener siniestros del beneficiario:", error);
    next(error);
    return res.status(500).json({ message: "Error al obtener los siniestros." });
  }
};

// 📌 **Obtener detalle completo del siniestro**
// 📌 **Obtener detalle completo del siniestro**
export const obtenerDetalleSiniestroCompleto = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const { siniestroid } = req.params;
  
      console.log('SiniestroID recibido:', siniestroid); // Log para verificar el siniestroid recibido
  
      if (!siniestroid) {
        return res.status(400).json({ message: "SiniestroID es requerido." });
      }
  
      const { rows: siniestroRows } = await pool.query(
        "SELECT * FROM siniestros WHERE siniestroid = $1",
        [siniestroid]
      );
  
      console.log('Datos del siniestro encontrado:', siniestroRows); // Log para verificar los datos del siniestro
  
      if (siniestroRows.length === 0) {
        return res.status(404).json({ message: "Siniestro no encontrado." });
      }
  
      const siniestro = siniestroRows[0];
  
      const { rows: reclamaciones } = await pool.query(
        `SELECT r.*, json_agg(d.*) AS documentos
         FROM reclamacion r
         LEFT JOIN documentosreclamacion d ON r.reclamacionid = d.reclamacionid
         WHERE r.siniestroid = $1
         GROUP BY r.reclamacionid`,
        [siniestroid]
      );
  
      console.log('Reclamaciones asociadas al siniestro:', reclamaciones); // Log para verificar las reclamaciones obtenidas
  
      const { rows: presupuestos } = await pool.query(
        "SELECT * FROM presupuesto WHERE siniestroid = $1",
        [siniestroid]
      );
  
      console.log('Presupuestos asociados al siniestro:', presupuestos); // Log para verificar los presupuestos obtenidos
  
      // Ajuste en la consulta: Cambiar el nombre de la columna para asegurar que sea correcta
      console.log('Siniestro ID:', siniestroid);
      console.log('Taller ID en siniestros:', siniestroRows[0].tallerid);
  
      const { rows: talleres } = await pool.query(
        `SELECT t.nombre AS nombre_taller, t.direccion, t.telefono
         FROM taller t
         JOIN siniestros s ON s.tallerid = t.tallerid
         WHERE s.siniestroid = $1`,  // Asegúrate de usar el nombre correcto de la columna
        [siniestroid]
      );
  
      console.log('Talleres asociados al siniestro:', talleres); // Log para verificar los talleres obtenidos
  
      const { rows: documentos } = await pool.query(
        `SELECT dr.*, r.siniestroid
       FROM documentosreclamacion dr
       LEFT JOIN reclamacion r ON r.reclamacionid = dr.reclamacionid
       WHERE r.siniestroid = $1`,
        [siniestroid]
      );
  
      console.log('Documentos asociados al siniestro:', documentos); // Log para verificar los documentos obtenidos
  
      return res.status(200).json({
        siniestro,
        reclamaciones,
        presupuestos,
        talleres,
        documentos,
      });
    } catch (error) {
      console.error("Error al obtener detalles del siniestro:", error);
      return res.status(500).json({ message: "Error al obtener los detalles del siniestro" });
    }


  };
  
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
  
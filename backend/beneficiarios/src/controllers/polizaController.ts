import { Request, Response, NextFunction, RequestHandler } from "express";
import PolizaModel from "../models/polizaModel";
import pool from "../config/db";

export const createPoliza = async (req: Request, res: Response): Promise<void> => {
  const { BeneficiarioID, TipoPoliza } = req.body;
  console.log("BeneficiarioID:", BeneficiarioID);  // Verificar que el BeneficiarioID es el esperado.

  try {
    // Verificar si el BeneficiarioID existe en la tabla beneficiario
    const [beneficiarioResult]: any = await pool.query("SELECT * FROM beneficiario WHERE UsuarioID = ?", [BeneficiarioID]);

    console.log("Beneficiario encontrado:", beneficiarioResult);

    // Verificar si no se encontró el beneficiario
    if (beneficiarioResult.length === 0) {
      res.status(400).json({ error: "El BeneficiarioID no existe." });
      return;
    }

    // Acceder al primer objeto del resultado
    const beneficiario = beneficiarioResult[0];
    console.log("Beneficiario:", beneficiario);

    // Llamar al modelo para crear la póliza
    const result = await PolizaModel.createPoliza(beneficiario.BeneficiarioID, TipoPoliza);

    // Responder con éxito
    res.status(201).json({
      message: "Póliza creada exitosamente",
      polizaID: result.insertId,
    });
  } catch (error) {
    console.error('Error al crear la póliza:', error);
    res.status(500).json({ error: 'Error al crear la póliza' });
  }
};




export const getPolizas: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { beneficiarioID } = req.params;

    // Llamada al modelo para obtener las pólizas del beneficiario
    const result = await PolizaModel.getPolizas();
    console.log(result);
    if (!result || result.length === 0) {
      res.status(404).json({ message: "No se encontraron pólizas." });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPolizaByID: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { polizaID } = req.params;

    // Llamada al modelo para obtener la póliza por ID
    const result = await PolizaModel.getPolizaByID(Number(polizaID));

    if (!result || result.length === 0) {
      res.status(404).json({ message: "Póliza no encontrada." });
      return;
    }

    res.status(200).json(result[0]);  // Devuelve la póliza encontrada
  } catch (error) {
    next(error);
  }
};
export const getPolizasByDNI = async (req: Request, res: Response, next: NextFunction) => {
  const { DNI } = req.params;

  try {
    // Llamada al modelo para obtener las pólizas del beneficiario por su DNI
    const result = await PolizaModel.getPolizasByDNI(DNI);

    if (!result || result.length === 0) {
      res.status(404).json({ message: "No se encontraron pólizas para este beneficiario." });
      return;
    }

    res.status(200).json(result);  // Devuelve las pólizas encontradas
  } catch (error) {
    next(error);
  }
};
export const updatePolizaEstado = async (req: Request, res: Response, next: NextFunction) => {
  const { polizaID } = req.params;
  const { estado } = req.body;  // Recibe el estado para actualizar (por ejemplo: 'Inactiva')

  try {
    if (!estado) {
      res.status(400).json({ error: "El estado es obligatorio." });
      return;
    }

    // Llamada al modelo para actualizar el estado de la póliza
    const result = await PolizaModel.updatePolizaEstado(Number(polizaID), estado);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Póliza no encontrada." });
      return;
    }

    res.status(200).json({ message: "Estado de la póliza actualizado exitosamente." });
  } catch (error) {
    next(error);
  }
};
import { Request, Response,RequestHandler } from 'express';
import Joi from 'joi';
import pool from '../config/db';

export const getBeneficiarios = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('EXEC GetBeneficiarios'); // Nombre del procedimiento almacenado
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener beneficiarios' });
    }
};


const schema = Joi.object({
    Nombre: Joi.string().max(100).required(),
    Apellido: Joi.string().max(100).required(),
    Email: Joi.string().email().required(),
    Telefono: Joi.string().max(15).required(),
});

export const createBeneficiario: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { Nombre, Apellido, Email, Telefono } = req.body;
        await pool.query(
            'INSERT INTO beneficiario (Nombre, Apellido, Email, Telefono) VALUES (@Nombre, @Apellido, @Email, @Telefono)',
            {
                Nombre,
                Apellido,
                Email,
                Telefono
            }
        );
        res.status(201).json({ message: 'Beneficiario creado exitosamente' });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al crear beneficiario' });
    }
};


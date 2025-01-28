import { Request, Response, NextFunction } from 'express';
import { generateToken, verifyToken as verifyJwtToken, decodeToken } from '../utils/jwt';


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  try {
    const decoded = verifyJwtToken(token);
    req.body.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

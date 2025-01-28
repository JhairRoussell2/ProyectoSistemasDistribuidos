import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION, 10) : '1h';

/**
 * Genera un token JWT con los datos del usuario.
 * @param payload - Datos del usuario a incluir en el token.
 * @returns Token JWT como string.
 */
export const generateToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRATION };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifica un token JWT y devuelve los datos decodificados si es válido.
 * @param token - Token JWT a verificar.
 * @returns Datos del usuario decodificados o lanza error si no es válido.
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Decodifica un token JWT sin verificar su validez.
 * @param token - Token JWT a decodificar.
 * @returns Datos del usuario decodificados.
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

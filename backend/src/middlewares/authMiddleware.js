/**
 * @fileoverview Middleware de Autenticación y Autorización.
 * Verifica la validez de los tokens JWT enviados en los encabezados HTTP
 * y adjunta el usuario autenticado a la petición.
 */

import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

/**
 * Middleware para proteger rutas privadas mediante JWT.
 * 
 * Inspecciona el encabezado 'Authorization' buscando el formato 'Bearer <token>'.
 * Valida la firma y expiración del token y verifica que el usuario continúe
 * existiendo en la base de datos antes de ceder el control al siguiente middleware.
 * 
 * @async
 * @param {import('express').Request} req - Objeto de petición Express. Adjunta `req.usuario` en caso de éxito.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para transferir el control al siguiente middleware o capturador de errores.
 * @returns {Promise<void>}
 */
const protegerRuta = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        const error = new Error("No autorizado, no se proporcionó un token.");
        error.statusCode = 401;
        return next(error);
    }

    try {
      const decodificado = jwt.verify(token, process.env.JWT_SECRET);

      // Confirmar la existencia actual del usuario en la BD
      const result = await query(
        "SELECT id, email FROM usuarios WHERE id = $1",
        [decodificado.id],
      );

      const usuario = result.rows[0];

      if (!usuario) {
        const error = new Error("El usuario de este token ya no existe.");
        error.statusCode = 401;
        return next(error);
      }

      // Inyectar datos del usuario en la petición para consumo de los controladores
      req.usuario = usuario;
      next();
    } catch (error) {
        error.message = "No autorizado, token inválido o expirado.";
        error.statusCode = 401;
        next(error);
    }
};

export default protegerRuta;
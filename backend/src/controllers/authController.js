/**
 * @fileoverview Controlador de Autenticación.
 * Maneja las peticiones HTTP de registro e inicio de sesión de usuarios,
 * estructurando las respuestas estandarizadas JSON de la API.
 */

import * as authService from "../services/authService.js";

/**
 * Procesa la petición HTTP para registrar un nuevo usuario.
 * 
 * @async
 * @param {import('express').Request} req - Objeto de petición Express (contiene req.body sanitizado).
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al middleware de errores.
 * @returns {Promise<void>} Devuelve una respuesta HTTP 201 con los datos del nuevo usuario y el token JWT.
 */
export const registrarUsuario = async (req, res, next) => {
  try {
    const resultado = await authService.registroService(req.body);
    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado exitosamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Procesa la petición HTTP para el inicio de sesión de un usuario.
 * 
 * @async
 * @param {import('express').Request} req - Objeto de petición Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>} Devuelve una respuesta HTTP 200 con el perfil del usuario y el token JWT.
 */
export const loginUsuario = async (req, res, next) => {
  try {
    const resultado = await authService.loginService(req.body);
    res.status(200).json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

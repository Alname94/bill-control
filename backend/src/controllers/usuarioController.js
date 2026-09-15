/**
 * @fileoverview Controlador de Usuarios.
 * Administra las peticiones HTTP relacionadas con la gestión del perfil del usuario,
 * actualización de información personal, cambio de contraseña y eliminación de la cuenta.
 */

import * as usuarioService from "../services/usuarioService.js";

/**
 * Obtiene la información del perfil del usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (contiene `req.usuario.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con los datos del usuario.
 */
export const getUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.getUsuarioService(id);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario obtenido",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza la información del perfil del usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.usuario.id` y `req.body`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con el perfil actualizado.
 */
export const updateUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.updateUsuarioService(id, req.body);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario actualizado",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Procesa la solicitud para cambiar la contraseña del usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.usuario.id` y `req.body` con credenciales).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 confirmando la actualización de la contraseña.
 */
export const updatePassword = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.updatePasswordService(id, req.body);

    res.status(200).json({
      ok: true,
      mensaje: "Password actualizado exitosamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina la cuenta del usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (contiene `req.usuario.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con la confirmación de la eliminación.
 */
export const deleteUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.deleteUsuarioService(id);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario eliminado",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

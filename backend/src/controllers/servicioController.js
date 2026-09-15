/**
 * @fileoverview Controlador de Servicios.
 * Procesa las solicitudes HTTP para la gestión de servicios vinculados
 * a un usuario autenticado.
 */

import * as servicioService from "../services/servicioService.js"

/**
 * Registra un nuevo servicio asociado al usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.usuario.id` y `req.body`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 201 con el servicio creado.
 */
export const createServicio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const resultado = await servicioService.createServicioService(usuarioId, req.body);
    res.status(201).json({
      ok: true,
      mensaje: "Servicio creado correctamente",
      data: resultado
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Obtiene la lista de servicios del usuario autenticado con soporte de paginación mediante query params.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.usuario.id` y `req.query`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con el listado de servicios.
 */
export const getServiciosByUser = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const resultado = await servicioService.getServiciosByUserService(usuarioId, req.query);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Obtiene el detalle de un servicio por su ID asegurando la pertenencia al usuario.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id` y `req.usuario.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con los datos del servicio.
 */
export const getServicioById = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params?.id;
    const resultado = await servicioService.getServicioByIdService(servicioId, usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Actualiza la información de un servicio perteneciente al usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id`, `req.usuario.id` y `req.body`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con el servicio modificado.
 */
export const updateServicio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params?.id;
    const datos = req.body;
    const resultado = await servicioService.updateServicioService(servicioId, usuarioId, datos);
    res.status(200).json({
      ok: true,
      mensaje: "Servicio actualizado correctamente",
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Elimina un servicio específico del usuario autenticado.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id` y `req.usuario.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con la confirmación de la eliminación.
 */
export const deleteServicio = async (req, res, next) => {
  try {
    const servicioId = req.params?.id;
    const usuarioId = req.usuario.id;
    const resultado = await servicioService.deleteServicioService(servicioId, usuarioId);
    res.status(200).json({
      ok: true,
      mensaje: "Servicio eliminado correctamente",
      data: resultado
    });
  } catch (error) {
      next(error);
  }
};
/**
 * @fileoverview Controlador de Facturas.
 * Procesa las solicitudes HTTP relacionadas con la gestión de comprobantes/facturas,
 * extrayendo los parámetros del usuario autenticado, ejecutando la lógica de servicio
 * y devolviendo respuestas estructuradas.
 */

import * as facturaService from "../services/facturaService.js";

/**
 * Crea una nueva factura asociada a un servicio de un usuario.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.usuario.id`, `req.body.servicioId` y resto del cuerpo).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 201 con la factura recién creada.
 */
export const createFactura = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const { servicioId, ...datosFactura } = req.body;
    const resultado = await facturaService.createFacturaService(servicioId, usuarioId, datosFactura);
    res.status(201).json({
      ok: true,
      mensaje: "Factura creada correctamente",
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Obtiene el listado de facturas asociadas a un servicio específico con soporte de paginación.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (acepta `req.params.servicioId` o `req.params.id`, y `req.query`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con el listado de facturas y los meta-datos de paginación.
 */
export const getFacturasByServicio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params?.servicioId ?? req.params?.id;

    const resultado = await facturaService.getFacturasByServicioService(
      servicioId, usuarioId, req.query);

    res.status(200).json({
      ok: true,
      data: resultado.facturas,
      pagination: resultado.pagination,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Obtiene los detalles de una factura por su ID.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con la información detallada de la factura.
 */
export const getFacturaById = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params?.id;
    const resultado = await facturaService.getFacturaByIdService(id, usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Actualiza los datos de una factura existente.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id` y `req.body`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con la factura modificada.
 */
export const updateFactura = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params?.id;
    const datosFactura = req.body;
    const resultado = await facturaService.updateFacturaService(id, usuarioId, datosFactura);
    res.status(200).json({
      ok: true,
      mensaje: "Factura actualizada correctamente",
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

/**
 * Elimina una factura del sistema.
 * 
 * @async
 * @param {import('express').Request} req - Petición Express (espera `req.params.id`).
 * @param {import('express').Response} res - Respuesta Express.
 * @param {import('express').NextFunction} next - Middleware de manejo de errores.
 * @returns {Promise<void>} Código 200 con la confirmación de la eliminación.
 */
export const deleteFactura = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params?.id;
    const resultado = await facturaService.deleteFacturaService(id, usuarioId);
    res.status(200).json({
      ok: true,
      mensaje: "Factura eliminada correctamente",
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};
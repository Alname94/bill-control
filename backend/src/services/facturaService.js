/**
 * @fileoverview Capa service para Facturas.
 * Gestiona el ciclo de vida de los comprobantes asociados a un servicio,
 * asegurando la autorización multi-tenant mediante la verificación previa del servicio.
 */

import * as facturaModel from "../models/facturaModel.js"
import { getServicioByIdService } from "./servicioService.js";

/**
 * Crea una nueva factura vinculada a un servicio específico.
 * 
 * Valida primero que el servicio especificado exista y pertenezca al usuario autenticado.
 * 
 * @async
 * @param {number|string} servicioId - ID del servicio asociado.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} datosFactura - Datos de la factura.
 * @param {number} datosFactura.monto - Importe del comprobante.
 * @param {string} datosFactura.fechaVencimiento - Fecha de vencimiento (AAAA-MM-DD).
 * @param {boolean} [datosFactura.pagado] - Estado de pago inicial.
 * @throws {Error} 404 - Si el servicio no se encuentra o no pertenece al usuario.
 * @returns {Promise<import('../models/facturaModel.js').Factura>} Factura creada.
 */
export const createFacturaService = async (servicioId, usuarioId, datosFactura) => {
  const { monto, fechaVencimiento, pagado } = datosFactura;
  await getServicioByIdService(servicioId, usuarioId);

  const nuevaFactura = await facturaModel.createFactura(servicioId, {monto, fechaVencimiento, pagado});
  return nuevaFactura;
};

/**
 * Consulta las facturas de un servicio aplicando filtros de paginación y estado.
 * 
 * Sanea y acota los parámetros de consulta (límites de página entre 1 y 100).
 * 
 * @async
 * @param {number|string} servicioId - ID del servicio a consultar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} [queryParams={}] - Parámetros de búsqueda pasados por URL.
 * @param {string} [queryParams.page] - Número de página.
 * @param {string} [queryParams.limit] - Límite de ítems por página (máx. 100).
 * @param {string} [queryParams.pagado] - Cadena "true" o "false".
 * @param {string} [queryParams.fechaDesde] - Filtro de fecha inicial.
 * @param {string} [queryParams.fechaHasta] - Filtro de fecha final.
 * @returns {Promise<{ facturas: import('../models/facturaModel.js').Factura[], pagination: Object }>} Resultado paginado.
 */
export const getFacturasByServicioService = async (servicioId, usuarioId, queryParams = {}) => {
  await getServicioByIdService(servicioId, usuarioId);

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;

  let pagado;
  if (queryParams.pagado === "true") pagado = true;
  if (queryParams.pagado === "false") pagado = false;

  const opciones = {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 10,
    pagado,
    fechaDesde: queryParams.fechaDesde || null,
    fechaHasta: queryParams.fechaHasta || null,
  };

  return await facturaModel.getFacturasByServicio(servicioId, opciones);
};

/**
 * Recupera una factura específica verificando la pertenencia del servicio asociado.
 * 
 * @async
 * @param {number|string} id - ID de la factura a consultar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @throws {Error} 404 - Si la factura no existe o el servicio asociado no pertenece al usuario.
 * @returns {Promise<import('../models/facturaModel.js').Factura>} Objeto de la factura encontrada.
 */
export const getFacturaByIdService = async (id, usuarioId) => {
  const factura = await facturaModel.getFacturaById(id);
  if(!factura) {
    const error = new Error("No se encontró factura con ese ID.");
    error.statusCode = 404;
    throw error;
  }
  await getServicioByIdService(factura.servicioId, usuarioId);
  return factura;
};

/**
 * Actualiza los campos de una factura existente previa verificación de permisos.
 * 
 * @async
 * @param {number|string} id - ID de la factura a modificar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} datosFactura - Datos actualizados.
 * @returns {Promise<import('../models/facturaModel.js').Factura>} Factura modificada.
 */
export const updateFacturaService = async (id, usuarioId, datosFactura) => {
  await getFacturaByIdService(id, usuarioId);
  const { monto, fechaVencimiento, pagado } = datosFactura;
  const facturaActualizada = await facturaModel.updateFactura(id, {monto, fechaVencimiento, pagado});
  return facturaActualizada;
};

/**
 * Elimina una factura previa verificación de pertenencia del servicio asociado.
 * 
 * @async
 * @param {number|string} id - ID de la factura a eliminar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @returns {Promise<void>}
 */
export const deleteFacturaService = async (id, usuarioId) => {
  await getFacturaByIdService(id, usuarioId);
  await facturaModel.deleteFactura(id);
};

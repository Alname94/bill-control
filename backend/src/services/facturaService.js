import * as facturaModel from "../models/facturaModel.js"
import { getServicioByIdService } from "./servicioService.js";

export const createFacturaService = async (servicioId, usuarioId, datosFactura) => {
  const { monto, fechaVencimiento, pagado } = datosFactura;
  await getServicioByIdService(servicioId, usuarioId);

  const nuevaFactura = await facturaModel.createFactura(servicioId, {monto, fechaVencimiento, pagado});
  return nuevaFactura;
};

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

export const updateFacturaService = async (id, usuarioId, datosFactura) => {
  await getFacturaByIdService(id, usuarioId);
  const { monto, fechaVencimiento, pagado } = datosFactura;
  const facturaActualizada = await facturaModel.updateFactura(id, {monto, fechaVencimiento, pagado});
  return facturaActualizada;
};

export const deleteFacturaService = async (id, usuarioId) => {
  await getFacturaByIdService(id, usuarioId);
  await facturaModel.deleteFactura(id);
};

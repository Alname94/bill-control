import * as facturaService from "../services/facturaService.js"

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

export const getFacturasByServicio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params.id;
    const resultado = await facturaService.getFacturasByServicioService(servicioId, usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

export const getFacturaById = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params.id;
    const resultado = await facturaService.getFacturaByIdService(id, usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

export const updateFactura = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params.id;
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

export const deleteFactura = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const id = req.params.id;
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
import * as servicioService from "../services/servicioService.js"

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

export const getServiciosByUser = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const resultado = await servicioService.getServiciosByUserService(usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado
    });
  } catch (error) {
      next(error);
  }
};

export const getServicioById = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params.id;
    const resultado = await servicioService.getServicioByIdService(servicioId, usuarioId);
    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
      next(error);
  }
};

export const updateServicio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const servicioId = req.params.id;
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

export const deleteServicio = async (req, res, next) => {
  try {
    const servicioId = req.params.id;
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
import * as servicioModel from "../models/servicioModel.js";

export const createServicioService = async (usuarioId, datosServicio) => {
  const { nombre, nroCliente, activo } = datosServicio;
  await validarServicioExistente(nombre, usuarioId);

  const nuevoServicio = await servicioModel.createServicio(usuarioId, {nombre, nroCliente, activo});
  return nuevoServicio;
};

export const getServiciosByUserService = async (usuarioId) => {
  return await servicioModel.getServiciosByUser(usuarioId);
};

export const getServicioByIdService = async (id, usuarioId) => {
  const servicio = await servicioModel.getServicioById(id, usuarioId);
  if (!servicio) {
    const error = new Error("No se encontró servicio con ese ID.");
    error.statusCode = 404;
    throw error;
  }
  return servicio;
};

export const updateServicioService = async (id, usuarioId, datosServicio) => {
  await getServicioByIdService(id, usuarioId);
  const { nombre, nroCliente, activo } = datosServicio;
  await validarServicioExistente(nombre, usuarioId, id);
  const servicioActualizado = await servicioModel.updateServicio(id, usuarioId, {nombre, nroCliente, activo});
  return servicioActualizado;
};

export const deleteServicioService = async (id, usuarioId) => {
  await getServicioByIdService(id, usuarioId);
  await servicioModel.deleteServicio(id, usuarioId);
}

const validarServicioExistente = async (nombre, usuarioId, servicioIdExcluido = null) => {
  const servicioExistente = await servicioModel.getServicioByNombre(nombre, usuarioId);

  if (servicioExistente && servicioExistente.id !== parseInt(servicioIdExcluido, 10)) {
    const error = new Error("Ya existe un servicio con ese nombre.");
    error.statusCode = 400;
    throw error;
  }
};
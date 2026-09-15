/**
 * @fileoverview Capa service para la entidad Servicios.
 * Administra las reglas de negocio, prevención de duplicados por nombre,
 * paginación acotada y verificación de pertenencia por usuario.
 */

import * as servicioModel from "../models/servicioModel.js";

/**
 * Registra un nuevo servicio para un usuario específico.
 * 
 * Valida previamente que el usuario no posea otro servicio registrado con el mismo nombre.
 * 
 * @async
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} datosServicio - Datos del nuevo servicio.
 * @param {string} datosServicio.nombre - Nombre del servicio.
 * @param {string} [datosServicio.nroCliente] - Número de cliente opcional.
 * @param {boolean} [datosServicio.activo=true] - Estado del servicio.
 * @throws {Error} 400 - Si ya existe un servicio registrado con ese mismo nombre para el usuario.
 * @returns {Promise<import('../models/servicioModel.js').Servicio>} Servicio creado.
 */
export const createServicioService = async (usuarioId, datosServicio) => {
  const { nombre, nroCliente, activo } = datosServicio;
  await validarServicioExistente(nombre, usuarioId);

  const nuevoServicio = await servicioModel.createServicio(usuarioId, {nombre, nroCliente, activo});
  return nuevoServicio;
};

/**
 * Obtiene el listado paginado de servicios pertenecientes a un usuario.
 * 
 * Limita los parámetros de paginación para evitar cargas innecesarias (límite máximo de 100).
 * 
 * @async
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} [queryParams={}] - Parámetros de consulta pasados por URL.
 * @param {string} [queryParams.page] - Número de página solicitada.
 * @param {string} [queryParams.limit] - Cantidad de registros por página (máx. 100).
 * @returns {Promise<{ servicios: import('../models/servicioModel.js').Servicio[], pagination: Object }>} Resultado paginado.
 */
export const getServiciosByUserService = async (usuarioId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;

  const opciones = {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 10,
  };

  return await servicioModel.getServiciosByUser(usuarioId, opciones);
};

/**
 * Obtiene un servicio específico por su ID y valida la pertenencia al usuario.
 * 
 * @async
 * @param {number|string} id - ID del servicio a buscar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @throws {Error} 404 - Si no existe el servicio o no pertenece al usuario.
 * @returns {Promise<import('../models/servicioModel.js').Servicio>} Servicio encontrado.
 */
export const getServicioByIdService = async (id, usuarioId) => {
  const servicio = await servicioModel.getServicioById(id, usuarioId);
  if (!servicio) {
    const error = new Error("No se encontró servicio con ese ID.");
    error.statusCode = 404;
    throw error;
  }
  return servicio;
};

/**
 * Actualiza los datos de un servicio existente previa verificación de pertenencia y duplicados.
 * 
 * @async
 * @param {number|string} id - ID del servicio a modificar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {Object} datosServicio - Nuevos datos para el servicio.
 * @param {string} datosServicio.nombre - Nombre del servicio.
 * @param {string} [datosServicio.nroCliente] - Número de cliente opcional.
 * @param {boolean} [datosServicio.activo] - Estado del servicio.
 * @throws {Error} 404 - Si el servicio no existe o no le pertenece.
 * @throws {Error} 400 - Si el nuevo nombre coincide con otro servicio existente del mismo usuario.
 * @returns {Promise<import('../models/servicioModel.js').Servicio>} Servicio modificado.
 */
export const updateServicioService = async (id, usuarioId, datosServicio) => {
  await getServicioByIdService(id, usuarioId);
  const { nombre, nroCliente, activo } = datosServicio;
  await validarServicioExistente(nombre, usuarioId, id);
  const servicioActualizado = await servicioModel.updateServicio(id, usuarioId, {nombre, nroCliente, activo});
  return servicioActualizado;
};

/**
 * Elimina un servicio previa verificación de pertenencia al usuario.
 * 
 * @async
 * @param {number|string} id - ID del servicio a eliminar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @throws {Error} 404 - Si el servicio no existe o no le pertenece.
 * @returns {Promise<void>}
 */
export const deleteServicioService = async (id, usuarioId) => {
  await getServicioByIdService(id, usuarioId);
  await servicioModel.deleteServicio(id, usuarioId);
}

/**
 * Helper privado para validar si ya existe un servicio con el mismo nombre para el usuario.
 * 
 * Permite omitir el ID del servicio actual durante el proceso de edición (`updateServicioService`).
 * 
 * @async
 * @param {string} nombre - Nombre del servicio a verificar.
 * @param {string} usuarioId - UUID del usuario autenticado.
 * @param {number|string|null} [servicioIdExcluido=null] - ID del servicio a ignorar durante la comparación.
 * @throws {Error} 400 - Si el nombre ya está ocupado por otro servicio del mismo usuario.
 * @returns {Promise<void>}
 */
const validarServicioExistente = async (nombre, usuarioId, servicioIdExcluido = null) => {
  const servicioExistente = await servicioModel.getServicioByNombre(nombre, usuarioId);

  if (servicioExistente && servicioExistente.id !== parseInt(servicioIdExcluido, 10)) {
    const error = new Error("Ya existe un servicio con ese nombre.");
    error.statusCode = 400;
    throw error;
  }
};
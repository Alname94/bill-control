/**
 * @fileoverview Modelo de datos para la entidad Servicios.
 * Implementa el acceso a datos para la gestión de servicios vinculados
 * a un usuario específico, garantizando aislamiento multi-tenant en PostgreSQL.
 */

import { query } from "../config/db.js";

/**
 * Interface que representa un Servicio en la base de datos.
 * 
 * @typedef {Object} Servicio
 * @property {number} id - Identificador único del servicio (SERIAL).
 * @property {string} usuarioId - UUID del usuario propietario.
 * @property {string} nombre - Nombre descriptivo del servicio.
 * @property {string|null} nroCliente - Número de cliente o referencia de la cuenta.
 * @property {boolean} activo - Estado del servicio.
 * @property {Date} [creadoEn] - Fecha de creación del registro.
 */

/**
 * Crea un nuevo servicio asociado a un usuario.
 * 
 * @async
 * @param {string} usuarioId - UUID del usuario propietario.
 * @param {Object} datosServicio - Datos del servicio a registrar.
 * @param {string} datosServicio.nombre - Nombre del servicio (convertido a mayúsculas por validación).
 * @param {string} [datosServicio.nroCliente=null] - Número de cliente opcional.
 * @param {boolean} [datosServicio.activo=true] - Estado inicial del servicio.
 * @returns {Promise<Servicio>} Servicio creado mapeado en camelCase.
 */
export const createServicio = async (usuarioId, datosServicio) => {
  const { nombre, nroCliente, activo } = datosServicio;

  const result = await query(
    `INSERT INTO servicios (usuario_id, nombre, nro_cliente, activo)
     VALUES ($1, $2, $3, COALESCE($4, TRUE))
     RETURNING id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"`,
    [usuarioId, nombre, nroCliente ?? null, activo ?? true],
  );

  return result.rows[0];
};

/**
 * Obtiene la lista paginada de servicios pertenecientes a un usuario.
 * 
 * @async
 * @param {string} usuarioId - UUID del usuario solicitante.
 * @param {Object} [opciones={}] - Opciones de paginación.
 * @param {number} [opciones.page=1] - Número de página.
 * @param {number} [opciones.limit=10] - Cantidad de registros por página.
 * @returns {Promise<{ servicios: Servicio[], pagination: { total: number, page: number, limit: number, totalPages: number } }>} Lista paginada y metadatos.
 */
export const getServiciosByUser = async (usuarioId, opciones = {}) => {
  const { page = 1, limit = 10 } = opciones;

  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"
    FROM servicios
    WHERE usuario_id = $1
    ORDER BY nombre ASC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*)::INT "total"
    FROM servicios
    WHERE usuario_id = $1
  `;

  const serviciosResult = await query(dataQuery, [usuarioId, limit, offset]);
  const countResult = await query(countQuery, [usuarioId]);

  const total = countResult.rows[0].total;

  return {
    servicios: serviciosResult.rows,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Busca un servicio específico por su ID garantizando que pertenezca al usuario autenticado.
 * 
 * @async
 * @param {number|string} id - ID del servicio.
 * @param {string} usuarioId - UUID del usuario propietario.
 * @returns {Promise<Servicio|undefined>} Objeto Servicio o `undefined` si no existe o no le pertenece.
 */
export const getServicioById = async (id, usuarioId) => {
  const result = await query(
    `SELECT id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"
     FROM servicios
     WHERE id = $1 AND usuario_id = $2`,
    [parseInt(id, 10), usuarioId],
  );
  return result.rows[0];
};

/**
 * Busca un servicio por su nombre exacto para un usuario en particular.
 * 
 * Útil para prevenir duplicados a nivel de negocio por cada usuario.
 * 
 * @async
 * @param {string} nombre - Nombre del servicio a buscar.
 * @param {string} usuarioId - UUID del usuario.
 * @returns {Promise<Servicio|undefined>} Objeto Servicio o `undefined` si no existe.
 */
export const getServicioByNombre = async (nombre, usuarioId) => {
  const result = await query(
    `SELECT id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"
     FROM servicios
     WHERE nombre = $1 AND usuario_id = $2`,
    [nombre, usuarioId],
  );
  return result.rows[0];
};

/**
 * Actualiza la información de un servicio perteneciente al usuario.
 * 
 * @async
 * @param {number|string} id - ID del servicio a actualizar.
 * @param {string} usuarioId - UUID del usuario propietario.
 * @param {Object} datosServicio - Campos a modificar.
 * @param {string} datosServicio.nombre - Nombre actualizado.
 * @param {string} [datosServicio.nroCliente=null] - Nuevo número de cliente.
 * @param {boolean} [datosServicio.activo=true] - Nuevo estado del servicio.
 * @returns {Promise<Servicio>} Servicio modificado.
 */
export const updateServicio = async (id, usuarioId, datosServicio) => {
  const { nombre, nroCliente, activo } = datosServicio;

  const result = await query(
    `UPDATE servicios SET nombre = $1, nro_cliente = $2, activo = $3
     WHERE id = $4 AND usuario_id = $5
     RETURNING id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"`,
    [nombre, nroCliente ?? null, activo ?? true, parseInt(id, 10), usuarioId],
  );
  return result.rows[0];
};

/**
 * Elimina un servicio de la base de datos asegurando la pertenencia al usuario.
 * 
 * @async
 * @param {number|string} id - ID del servicio a eliminar.
 * @param {string} usuarioId - UUID del usuario propietario.
 * @returns {Promise<number>} Cantidad de registros eliminados.
 */
export const deleteServicio = async (id, usuarioId) => {
  const result = await query(
    "DELETE from servicios WHERE id = $1 AND usuario_id = $2",
    [parseInt(id, 10), usuarioId],
  );
  return result.rowCount;
};
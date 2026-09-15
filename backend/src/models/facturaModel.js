/**
 * @fileoverview Modelo de datos para la entidad Facturas.
 * Contiene la capa de acceso a datos (DAL) para consultar, crear,
 * filtrar con paginación, actualizar y eliminar facturas en PostgreSQL.
 */

import { query } from "../config/db.js";

/**
 * Interface que representa una Factura en la base de datos.
 * 
 * @typedef {Object} Factura
 * @property {number} id - Identificador único de la factura (SERIAL).
 * @property {number} servicioId - ID del servicio al que pertenece.
 * @property {number} monto - Monto de la factura.
 * @property {string} fechaVencimiento - Fecha de vencimiento (AAAA-MM-DD).
 * @property {boolean} pagado - Estado de pago de la factura.
 * @property {Date} [creadoEn] - Fecha de creación del registro.
 */

/**
 * Creador de una nueva factura en la base de datos.
 * 
 * @async
 * @param {number|string} servicioId - ID del servicio asociado.
 * @param {Object} datosFactura - Datos de la factura.
 * @param {number} datosFactura.monto - Importe total.
 * @param {string} datosFactura.fechaVencimiento - Fecha de vencimiento.
 * @param {boolean} [datosFactura.pagado=false] - Estado inicial del pago.
 * @returns {Promise<Factura>} Factura creada mapeada en camelCase.
 */
export const createFactura = async (servicioId, datosFactura) => {
  const { monto, fechaVencimiento, pagado } = datosFactura;

  const result = await query(
    `INSERT INTO facturas (servicio_id, monto, fecha_vencimiento, pagado)
     VALUES ($1, $2, $3, COALESCE($4, FALSE))
     RETURNING id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado, creado_en "creadoEn"`,
    [parseInt(servicioId, 10), monto, fechaVencimiento, pagado ?? false],
  );
  return result.rows[0];
};

/**
 * Consulta y pagina las facturas asociadas a un servicio aplicando filtros opcionales.
 * 
 * @async
 * @param {number|string} servicioId - ID del servicio a consultar.
 * @param {Object} [opciones={}] - Opciones de filtrado y paginación.
 * @param {boolean} [opciones.pagado] - Filtrar por estado de pago (true/false).
 * @param {string} [opciones.fechaDesde] - Límite inferior de vencimiento.
 * @param {string} [opciones.fechaHasta] - Límite superior de vencimiento.
 * @param {number} [opciones.page=1] - Número de página actual.
 * @param {number} [opciones.limit=10] - Cantidad de registros por página.
 * @returns {Promise<{ facturas: Factura[], pagination: { total: number, page: number, limit: number, totalPages: number } }>} Resultado paginado.
 */
export const getFacturasByServicio = async (servicioId, opciones = {}) => {
  const { pagado, fechaDesde, fechaHasta, page = 1, limit = 10 } = opciones;

  const offset = (page - 1) * limit;
  const params = [parseInt(servicioId, 10)];
  const conditions = ["servicio_id = $1"];

  if (pagado !== undefined) {
    params.push(pagado);
    conditions.push(`pagado = $${params.length}`);
  }

  if (fechaDesde) {
    params.push(fechaDesde);
    conditions.push(`fecha_vencimiento >= $${params.length}`);
  }

  if (fechaHasta) {
    params.push(fechaHasta);
    conditions.push(`fecha_vencimiento <= $${params.length}`);
  }

  const whereClause = conditions.join(" AND ");

  const dataQuery = `
    SELECT id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado, creado_en "creadoEn"
    FROM facturas
    WHERE ${whereClause}
    ORDER BY fecha_vencimiento DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*)::INT "total"
    FROM facturas
    WHERE ${whereClause}
  `;

  const facturasResult = await query(dataQuery, [...params, limit, offset]);
  const countResult = await query(countQuery, params);

  const total = countResult.rows[0].total;

  return {
    facturas: facturasResult.rows,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Obtiene una factura por su ID primario.
 * 
 * @async
 * @param {number|string} id - ID de la factura.
 * @returns {Promise<Factura|undefined>} Objeto de la factura o `undefined` si no existe.
 */
export const getFacturaById = async (id) => {
  const result = await query(
    `SELECT id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado
     from facturas WHERE id = $1`, [parseInt(id, 10)]);
  return result.rows[0];
};

/**
 * Actualiza los datos de una factura existente.
 * 
 * @async
 * @param {number|string} id - ID de la factura a actualizar.
 * @param {Object} datosFactura - Nuevos datos.
 * @param {number} datosFactura.monto - Monto actualizado.
 * @param {string} datosFactura.fechaVencimiento - Nueva fecha de vencimiento.
 * @param {boolean} [datosFactura.pagado=false] - Estado del pago.
 * @returns {Promise<Factura>} Factura modificada.
 */
export const updateFactura = async (id, datosFactura) => {
  const { monto, fechaVencimiento, pagado } = datosFactura;

  const result = await query(
    `UPDATE facturas SET monto = $1, fecha_vencimiento = $2, pagado = $3
     WHERE id = $4
     RETURNING id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado, creado_en "creadoEn"`,
    [monto, fechaVencimiento, pagado ?? false, parseInt(id, 10)],
  );
  return result.rows[0];
};

/**
 * Elimina una factura de la base de datos por su ID.
 * 
 * @async
 * @param {number|string} id - ID de la factura a eliminar.
 * @returns {Promise<number>} Número de filas eliminadas (1 si tuvo éxito, 0 si no se encontró).
 */
export const deleteFactura = async (id) => {
  const result = await query("DELETE from facturas WHERE id = $1", [parseInt(id, 10),]);
  return result.rowCount;
};
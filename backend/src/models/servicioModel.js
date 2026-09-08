import { query } from "../config/db.js";

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

export const getServicioById = async (id, usuarioId) => {
  const result = await query(
    `SELECT id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"
     FROM servicios
     WHERE id = $1 AND usuario_id = $2`,
    [parseInt(id, 10), usuarioId],
  );
  return result.rows[0];
};

export const getServicioByNombre = async (nombre, usuarioId) => {
  const result = await query(
    `SELECT id, usuario_id "usuarioId", nombre, nro_cliente "nroCliente", activo, creado_en "creadoEn"
     FROM servicios
     WHERE nombre = $1 AND usuario_id = $2`,
    [nombre, usuarioId],
  );
  return result.rows[0];
};

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

export const deleteServicio = async (id, usuarioId) => {
  const result = await query(
    "DELETE from servicios WHERE id = $1 AND usuario_id = $2",
    [parseInt(id, 10), usuarioId],
  );
  return result.rowCount;
};
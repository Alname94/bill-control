import { query } from "../config/db.js";

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

export const getFacturaById = async (id) => {
  const result = await query(
    `SELECT id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado
     from facturas WHERE id = $1`, [parseInt(id, 10)]);
  return result.rows[0];
};

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

export const deleteFactura = async (id) => {
  const result = await query("DELETE from facturas WHERE id = $1", [parseInt(id, 10),]);
  return result.rowCount;
};
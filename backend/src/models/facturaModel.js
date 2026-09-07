import { query } from "../config/db.js";

export const createFactura = async (servicioId, datosFactura) => {
  const {monto, fechaVencimiento, pagado} = datosFactura;

  const result = await query(
    `INSERT INTO facturas (servicio_id, monto, fecha_vencimiento, pagado)
     VALUES ($1, $2, $3, COALESCE($4, FALSE))
     RETURNING id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado, creado_en "creadoEn"`,
    [parseInt(servicioId, 10), monto, fechaVencimiento, pagado ?? false],
  );
  return result.rows[0];
};

export const getFacturasByServicio = async (servicioId) => {
  const result = await query(
    `SELECT id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado
     from facturas WHERE servicio_id = $1 ORDER BY fecha_vencimiento DESC`,
    [parseInt(servicioId, 10)],
  );
  return result.rows;
};

export const getFacturaById = async (id) => {
  const result = await query(
    `SELECT id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado
     from facturas WHERE id = $1`, [parseInt(id, 10)]
  );
  return result.rows[0];
};

export const updateFactura = async (id, datosFactura) => {
  const { monto, fechaVencimiento, pagado } = datosFactura;

  const result = await query(
    `UPDATE facturas SET monto = $1, fecha_vencimiento = $2, pagado = $3
     WHERE id = $4
     RETURNING id, servicio_id "servicioId", monto, fecha_vencimiento "fechaVencimiento", pagado, creado_en "creadoEn"`,
     [monto, fechaVencimiento, pagado ?? false, parseInt(id, 10)]
  );
  return result.rows[0];
};

export const deleteFactura = async (id) => {
  const result = await query(
    "DELETE from facturas WHERE id = $1", [parseInt(id, 10)]
  );
  return result.rowCount;
};
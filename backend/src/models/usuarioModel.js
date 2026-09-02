import { query } from "../config/db.js"

export const findUserById = async (id) => {
  const result = await query(
    `SELECT id, nombre, email from usuarios WHERE id = $1`, [id]
  );
  return result.rows[0];
};

export const findUserByIdWithPassword = async (id) => {
  const result = await query(
    "SELECT id, password FROM usuarios WHERE id = $1", [id]
  );
  return result.rows[0];
};

export const updateUser = async (id, { nombre }) => {
  const result = await query(
    `UPDATE usuarios 
     SET nombre = $1
     WHERE id = $2 
     RETURNING id, nombre, email`,
    [nombre, id],
  );
  return result.rows[0];
};

export const updatePassword = async (id, passwordHash) => {
  const result = await query(
    "UPDATE usuarios SET password = $1 WHERE id = $2 RETURNING id", [passwordHash, id]
  );
  return result.rows[0];
}

export const deleteUser = async (id) => {
  const result = await query(
    `DELETE from usuarios WHERE id = $1`, [id]
  )
  return result.rowCount;
};

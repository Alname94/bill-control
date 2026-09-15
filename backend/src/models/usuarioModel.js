/**
 * @fileoverview Operaciones adicionales de lectura y actualización para la entidad Usuarios.
 * Proporciona métodos para consultar perfiles por ID, modificar datos personales,
 * actualizar credenciales y eliminar cuentas de usuario en PostgreSQL.
 */

import { query } from "../config/db.js"

/**
 * Busca el perfil público de un usuario por su ID único.
 * 
 * @async
 * @param {string} id - UUID del usuario a buscar.
 * @returns {Promise<Omit<import('./userModel.js').Usuario, 'password'>|undefined>} Objeto de usuario sin credenciales o `undefined` si no existe.
 */
export const findUserById = async (id) => {
  const result = await query(
    `SELECT id, nombre, email from usuarios WHERE id = $1`, [id]
  );
  return result.rows[0];
};

/**
 * Recupera únicamente el hash de la contraseña de un usuario por su ID.
 * 
 * Método auxiliar reservado exclusivamente para procesos de reautenticación
 * y cambio de contraseña.
 * 
 * @async
 * @param {string} id - UUID del usuario.
 * @returns {Promise<{ id: string, password: string }|undefined>} Objeto con id y hash de contraseña, o `undefined`.
 */
export const findUserByIdWithPassword = async (id) => {
  const result = await query(
    "SELECT id, password FROM usuarios WHERE id = $1", [id]
  );
  return result.rows[0];
};

/**
 * Actualiza la información personal (nombre) del perfil de un usuario.
 * 
 * @async
 * @param {string} id - UUID del usuario a modificar.
 * @param {Object} datosActualizacion - Objeto con los nuevos datos.
 * @param {string} datosActualizacion.nombre - Nuevo nombre del usuario.
 * @returns {Promise<Omit<import('./userModel.js').Usuario, 'password'>>} Usuario actualizado.
 */
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

/**
 * Actualiza el hash de la contraseña de un usuario.
 * 
 * @async
 * @param {string} id - UUID del usuario.
 * @param {string} passwordHash - Nueva contraseña ya hasheada con bcrypt.
 * @returns {Promise<{ id: string }>} Objeto que confirma la actualización del ID.
 */
export const updatePassword = async (id, passwordHash) => {
  const result = await query(
    "UPDATE usuarios SET password = $1 WHERE id = $2 RETURNING id", [passwordHash, id]
  );
  return result.rows[0];
}

/**
 * Elimina permanentemente la cuenta de un usuario de la base de datos.
 * 
 * @async
 * @param {string} id - UUID del usuario a eliminar.
 * @returns {Promise<number>} Cantidad de filas eliminadas.
 */
export const deleteUser = async (id) => {
  const result = await query(
    `DELETE from usuarios WHERE id = $1`, [id]
  )
  return result.rowCount;
};

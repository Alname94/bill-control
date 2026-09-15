/**
 * @fileoverview Modelo de datos para la entidad Usuarios.
 * Contiene la capa de acceso a datos (Data Access Layer) para consultar,
 * insertar y gestionar cuentas de usuario en PostgreSQL.
 */

import { query } from '../config/db.js';

/**
 * Interface/Objeto de respuesta que representa la entidad Usuario en la BD.
 * 
 * @typedef {Object} Usuario
 * @property {string} id - UUID del usuario.
 * @property {string} nombre - Nombre completo del usuario.
 * @property {string} email - Correo electrónico único.
 * @property {string} [password] - Hash de la contraseña (solo en consultas de autenticación).
 * @property {Date} [creado_en] - Fecha de creación del registro.
 */

/**
 * Busca un usuario registrado en la base de datos por su dirección de email.
 * 
 * @async
 * @param {string} email - Correo electrónico del usuario a buscar.
 * @returns {Promise<Usuario|undefined>} Retorna el objeto del usuario (incluyendo el hash de contraseña) o `undefined` si no existe.
 */
export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, nombre, email, password FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

/**
 * Inserta un nuevo registro de usuario en la base de datos.
 * 
 * @async
 * @param {Object} datosUsuario - Objeto con los datos del nuevo usuario.
 * @param {string} datosUsuario.nombre - Nombre del usuario.
 * @param {string} datosUsuario.email - Correo electrónico.
 * @param {string} datosUsuario.password - Contraseña ya hasheada con bcrypt.
 * @returns {Promise<Omit<Usuario, 'password'>>} Retorna el usuario recién creado sin incluir la contraseña.
 */
export const createUser = async ({ nombre, email, password }) => {
  const result = await query(
    `INSERT INTO usuarios (nombre, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, email, creado_en`,
    [nombre, email, password]
  );
  return result.rows[0];
};
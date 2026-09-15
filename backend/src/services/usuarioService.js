/**
 * @fileoverview Capa servicepara la entidad Usuario.
 * Maneja la lectura del perfil, actualización de datos personales,
 * eliminación de la cuenta y el cambio seguro de contraseña.
 */

import * as usuarioModel from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";

/**
 * Obtiene el perfil público de un usuario por su ID.
 * 
 * @async
 * @param {string} id - UUID del usuario autenticado.
 * @throws {Error} 404 - Si no existe un usuario registrado con ese ID.
 * @returns {Promise<Omit<import('../models/usuarioModel.js').Usuario, 'password'>>} Objeto del usuario sin credenciales.
 */
export const getUsuarioService = async (id) => {
  const usuario = await usuarioModel.findUserById(id);
  if (!usuario) {
    const error = new Error("No se encontró usuario con ese ID.");
    error.statusCode = 404;
    throw error;
  }
  return usuario;
};

/**
 * Actualiza los datos personales (nombre) del perfil de un usuario.
 * 
 * @async
 * @param {string} id - UUID del usuario a actualizar.
 * @param {Object} datos - Objeto con los datos a modificar.
 * @param {string} datos.nombre - Nuevo nombre del usuario.
 * @throws {Error} 404 - Si el usuario no existe.
 * @returns {Promise<Omit<import('../models/usuarioModel.js').Usuario, 'password'>>} Objeto de usuario actualizado.
 */
export const updateUsuarioService = async (id, nombre) => {
  await getUsuarioService(id);
  const usuarioActualizado = await usuarioModel.updateUser(
    id,
    nombre,
  );
  return usuarioActualizado;
};

/**
 * Elimina la cuenta de usuario de la base de datos.
 * 
 * @async
 * @param {string} id - UUID del usuario a eliminar.
 * @throws {Error} 404 - Si el usuario no existe.
 * @returns {Promise<void>}
 */
export const deleteUsuarioService = async (id) => {
  await getUsuarioService(id);
  await usuarioModel.deleteUser(id);
};

/**
 * Actualiza la contraseña de un usuario validando primero su clave actual.
 * 
 * @async
 * @param {string} id - UUID del usuario autenticado.
 * @param {Object} credenciales - Objeto con la contraseña actual y la nueva.
 * @param {string} credenciales.passwordActual - Contraseña actual enviada por el usuario.
 * @param {string} credenciales.passwordNuevo - Nueva contraseña en texto plano a ser hasheada.
 * @throws {Error} 404 - Si el usuario no existe.
 * @throws {Error} 401 - Si la contraseña actual proporcionada no coincide con el hash almacenado.
 * @returns {Promise<void>}
 */
export const updatePasswordService = async (id, { passwordActual, passwordNuevo }) => {
  const usuario = await usuarioModel.findUserByIdWithPassword(id);
  if (!usuario) {
    const error = new Error("Usuario no encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const esValido = await bcrypt.compare(passwordActual, usuario.password);
  if (!esValido) {
    const error = new Error("Password actual es incorrecto.");
    error.statusCode = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const nuevoHash = await bcrypt.hash(passwordNuevo, salt);

  await usuarioModel.updatePassword(id, nuevoHash);
};

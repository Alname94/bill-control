/**
 * @fileoverview Capa service para Autenticación.
 * Implementa la lógica de negocio para el registro e inicio de sesión de usuarios,
 * incluyendo el cifrado de contraseñas con bcryptjs y la emisión de tokens JWT.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authModel from "../models/authModel.js";

/**
 * Genera un token JWT firmado para un usuario específico.
 * 
 * @param {string} usuarioId - UUID del usuario.
 * @returns {string} Token JWT firmado.
 */
const generarToken = (usuarioId) => {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Registra un nuevo usuario en la aplicación.
 * 
 * Verifica que el email no esté en uso, genera el salt/hash de la contraseña,
 * persiste la cuenta en PostgreSQL y genera el token de sesión inicial.
 * 
 * @async
 * @param {Object} datosRegistro - Datos para la creación de cuenta.
 * @param {string} datosRegistro.nombre - Nombre completo del usuario.
 * @param {string} datosRegistro.email - Correo electrónico único.
 * @param {string} datosRegistro.password - Contraseña en texto plano a ser hasheada.
 * @throws {Error} 400 - Si el correo electrónico ya se encuentra registrado.
 * @returns {Promise<{ usuario: Omit<import('../models/authModel.js').Usuario, 'password'>, token: string }>} Objeto con el usuario creado (sin contraseña) y el token JWT.
 */
export const registroService = async ({ nombre, email, password }) => {
  const usuarioExistente = await authModel.findUserByEmail(email);
  if (usuarioExistente) {
    const error = new Error("El correo electrónico ya está registrado.");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const nuevoUsuario = await authModel.createUser({
    nombre,
    email,
    password: passwordHash,
  });

  const token = generarToken(nuevoUsuario.id);

  return {
    usuario: nuevoUsuario,
    token,
  };
};

/**
 * Autentica un usuario existente mediante sus credenciales.
 * 
 * Compara la contraseña ingresada con el hash almacenado en la BD
 * y remueve el hash antes de devolver la respuesta.
 * 
 * @async
 * @param {Object} credenciales - Credenciales de acceso.
 * @param {string} credenciales.email - Correo electrónico registrado.
 * @param {string} credenciales.password - Contraseña enviada en el intento de login.
 * @throws {Error} 401 - Si el usuario no existe o la contraseña es incorrecta.
 * @returns {Promise<{ usuario: Omit<import('../models/authModel.js').Usuario, 'password'>, token: string }>} Objeto con los datos del usuario y el token de sesión.
 */
export const loginService = async ({ email, password }) => {
  const usuario = await authModel.findUserByEmail(email);
  if (!usuario) {
    const error = new Error("Credenciales inválidas.");
    error.statusCode = 401;
    throw error;
  }

  const esPasswordValido = await bcrypt.compare(password, usuario.password);
  if (!esPasswordValido) {
    const error = new Error("Credenciales inválidas.");
    error.statusCode = 401;
    throw error;
  }

  const token = generarToken(usuario.id);

  const { password: _, ...usuarioSinPassword } = usuario;

  return {
    usuario: usuarioSinPassword,
    token,
  };
};

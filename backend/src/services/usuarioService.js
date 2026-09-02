import * as usuarioModel from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";

export const getUsuarioService = async (id) => {
  const usuario = await usuarioModel.findUserById(id);
  if (!usuario) {
    const error = new Error("No se encontró usuario con ese ID.");
    error.statusCode = 404;
    throw error;
  }
  return usuario;
};

export const updateUsuarioService = async (id, nombre) => {
  await getUsuarioService(id);
  const usuarioActualizado = await usuarioModel.updateUser(
    id,
    nombre,
  );
  return usuarioActualizado;
};

export const deleteUsuarioService = async (id) => {
  await getUsuarioService(id);
  await usuarioModel.deleteUser(id);
};

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

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authModel from "../models/authModel.js";

const generarToken = (usuarioId) => {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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

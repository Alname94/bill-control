import * as authService from "../services/authService.js";

export const registrarUsuario = async (req, res, next) => {
  try {
    const resultado = await authService.registroService(req.body);
    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado exitosamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUsuario = async (req, res, next) => {
  try {
    const resultado = await authService.loginService(req.body);
    res.status(200).json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

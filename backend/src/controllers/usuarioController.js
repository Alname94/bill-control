import * as usuarioService from "../services/usuarioService.js";

export const getUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.getUsuarioService(id);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario obtenido",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.updateUsuarioService(
      id,
      req.body,
    );

    res.status(200).json({
      ok: true,
      mensaje: "Usuario actualizado",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.updatePasswordService(
      id,
      req.body,
    );

    res.status(200).json({
      ok: true,
      mensaje: "Password actualizado exitosamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    const id = req.usuario.id;
    const resultado = await usuarioService.deleteUsuarioService(id);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario eliminado",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

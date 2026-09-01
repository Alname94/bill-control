export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Manejo explícito de errores de validación de Zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Error de validación",
      details: err.errors.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      })),
    });
  }

  // Error genérico o de base de datos
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
};
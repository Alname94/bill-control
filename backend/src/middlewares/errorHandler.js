/**
 * @fileoverview Middleware centralizado para el manejo de errores globales.
 * Intercepta fallos en la canalización de Express, mapea errores de validación (Zod)
 * y devuelve respuestas HTTP unificadas respetando el formato de la API.
 */


/**
 * Captura y procesa todos los errores pasados a través de `next(error)`.
 * 
 * Si el error proviene de una validación de Zod, formatea los campos fallidos en un
 * objeto `details` plano. Para otros errores, devuelve el código HTTP configurado (o 500).
 * 
 * @param {Error & { statusCode?: number, issues?: Array<{ path: Array<string|number>, message: string }>, errors?: Array<any> }} err - Objeto de error capturado.
 * @param {import('express').Request} req - Objeto de petición Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para continuar la ejecución de middlewares.
 * @returns {import('express').Response} Respuesta JSON estandarizada con el error formateado.
 */
export const errorHandler = (err, req, res, next) => {
  // Omitir logs de consola durante la ejecución de tests para mantener la salida limpia
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${err.message}`);
  }

  if (err.name === "ZodError" || err.issues) {
    const issues = err.issues || err.errors || [];

    // Mapear el arreglo de problemas de Zod a un objeto plano { nombreCampo: 'Mensaje de error' }
    const details = issues.reduce((acc, issue) => {
      const pathArray = issue.path[0] === "body" ? issue.path.slice(1) : issue.path;
      const campo = pathArray.join(".") || "general";
      acc[campo] = issue.message;
      return acc;
    }, {});

    return res.status(400).json({
      ok: false,
      error: "Error de validación",
      details,
    });
  }

  // Error genérico o de base de datos
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    ok: false,
    error: err.message || "Error interno del servidor",
  });
};
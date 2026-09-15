/**
 * @fileoverview Middleware de validación de esquemas Zod.
 * Proporciona un Order-Higher Function (HOF) para validar y sanitizar
 * los datos entrantes en el cuerpo (body), parámetros (params) y query params de la petición.
 */

/**
 * Genera un middleware de Express para validar la petición contra un esquema de Zod.
 * 
 * Evalúa `req.body`, `req.query` y `req.params`. En caso de éxito, reemplaza las propiedades
 * de la petición con los datos sanitizados/transformados por Zod. Si falla, delega
 * el error al middleware errorHandler.
 * 
 * @param {import('zod').ZodType} schema - Esquema Zod estructurado para validar la petición.
 * @returns {import('express').RequestHandler} Función middleware de Express.
 */
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.body = parsed.body;
    req.params = parsed.params;

    // Mutar req.query de forma segura para preservar la referencia en Express
    if (parsed.query) {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsed.query);
    }

    next();
  } catch (error) {
      next(error);
  }
};

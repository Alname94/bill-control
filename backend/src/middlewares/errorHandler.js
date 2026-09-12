export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${err.message}`);
  }

  if (err.name === "ZodError" || err.issues) {
    const issues = err.issues || err.errors || [];

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
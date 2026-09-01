export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    req.body = parsed.body;
    req.params = parsed.params;

    if (parsed.query) {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsed.query);
    }

    next();
  } catch (error) {
      next(error);
  }
};

/**
 * 404 handler for unmatched routes. Mounted after all routers.
 * @type {import('express').RequestHandler}
 */
export const notFound = (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
};

/**
 * Centralized error handler. Translates common Mongoose errors into 400s and
 * returns a consistent `{ error }` JSON shape for everything else.
 * @type {import('express').ErrorRequestHandler}
 */
export const errorHandler = (err, req, res, next) => {
  const isBadRequest = err.name === 'ValidationError' || err.name === 'CastError';
  const isDuplicate = err.code === 11000;
  const status = err.statusCode || (isDuplicate ? 409 : isBadRequest ? 400 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || 'Server error' });
};

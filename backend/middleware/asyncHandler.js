/**
 * Wrap an async Express handler so any thrown error / rejected promise is
 * forwarded to the centralized error middleware instead of crashing the process
 * or being silently swallowed. Removes repetitive try/catch from controllers.
 *
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<any>} fn
 * @returns {import('express').RequestHandler}
 */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

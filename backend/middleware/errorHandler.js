module.exports = (err, req, res, next) => {
  // Log the error details
  const logger = require('../utils/logger');
  logger.error('Error: %s', err.message, { stack: err.stack, path: req.path, method: req.method });

  // Do not leak internal details in production
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  res.status(status).json({ error: message });
};

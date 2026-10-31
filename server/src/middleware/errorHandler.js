export function errorHandler(err, req, res, next) {
  console.error('[Application Error]:', err);

  // Zod validation error handling
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token'
    });
  }

  // Generic or unexpected errors
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'A secure server error occurred. Please try again later.'
    : err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message
  });
}

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Custom validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details?.map(detail => detail.message) || [err.message]
    });
  }

  // Custom not found errors
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // PostgreSQL errors
  if (err.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    });
  }

  if (err.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced record does not exist'
    });
  }

  if (err.code === '23514') { // Check constraint violation
    return res.status(400).json({
      error: 'Constraint violation',
      message: 'Data violates database constraints'
    });
  }

  // Registration-specific errors (thrown by Registration model)
  if (err.message.includes('already registered')) {
    return res.status(409).json({
      error: 'Registration Error',
      message: err.message
    });
  }

  if (err.message.includes('full') || err.message.includes('capacity')) {
    return res.status(400).json({
      error: 'Capacity Error',
      message: err.message
    });
  }

  if (err.message.includes('past events')) {
    return res.status(400).json({
      error: 'Invalid Operation',
      message: err.message
    });
  }

  if (err.message.includes('not found') || err.message.includes('Not found')) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Joi validation errors (if passed through)
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details.map(detail => detail.message)
    });
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed'
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

export default errorHandler;
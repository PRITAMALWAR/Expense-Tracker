// Simple centralized error handler helpers

// Not found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Main error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Error handler:', err);
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
};

module.exports = { notFound, errorHandler };



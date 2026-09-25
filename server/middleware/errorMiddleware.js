export const errorMiddleware = (err, req, res, next) => {
  console.error('💥 Unhandled Error:', err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred on the server.',
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

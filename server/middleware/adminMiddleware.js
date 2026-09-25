export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
      errorCode: 'FORBIDDEN_ADMIN_ONLY',
    });
  }
  next();
};

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Admin access only' });
  }

  const isRoleAdmin = req.user.role === 'admin';
  const isEmailAdmin =
    typeof req.user.email === 'string' &&
    req.user.email.toLowerCase() === ADMIN_EMAIL;

  if (!isRoleAdmin && !isEmailAdmin) {
    return res.status(403).json({ message: 'Admin access only' });
  }

  next();
};

module.exports = adminMiddleware;



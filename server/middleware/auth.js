const jwt = require('jsonwebtoken');

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }
  return secret;
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] });
    req.admin = payload;
    req.adminId = payload.adminUserId;
    req.adminUsername = payload.username;
    req.adminPermissions = payload.permissions;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireSuperAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] });
    if (!payload.isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    req.admin = payload;
    req.adminId = payload.adminUserId;
    req.adminUsername = payload.username;
    req.adminPermissions = payload.permissions;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAdmin, requireSuperAdmin };

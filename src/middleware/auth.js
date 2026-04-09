const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT dans le header Authorization: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé.' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

/**
 * Vérifie que l'utilisateur connecté possède l'un des rôles autorisés.
 * @param {...string} roles
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}.` });
  }
  next();
};

module.exports = { authenticate, authorize };

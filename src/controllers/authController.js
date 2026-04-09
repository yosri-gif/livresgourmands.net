const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;
    const hash = await bcrypt.hash(password, ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (nom, email, password_hash) VALUES (?, ?, ?)',
      [nom, email, hash]
    );
    res.status(201).json({ message: 'Inscription réussie.', id: result.insertId });
  } catch (err) { next(err); }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND actif = TRUE', [email]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    const user  = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({
      token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

module.exports = { register, login };

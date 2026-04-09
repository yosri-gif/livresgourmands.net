const bcrypt = require('bcrypt');
const db     = require('../db');

// GET /api/users/me
const getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// GET /api/users  — admin seulement
const listUsers = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PUT /api/users/:id  — propriétaire ou admin
const updateUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id);
    const isOwner  = req.user.id === targetId;
    const isAdmin  = req.user.role === 'administrateur';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Accès refusé.' });

    const { nom, email, password, actif, role } = req.body;
    const fields = [], values = [];

    if (nom)      { fields.push('nom = ?');           values.push(nom); }
    if (email)    { fields.push('email = ?');         values.push(email); }
    if (password) {
      const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
      fields.push('password_hash = ?'); values.push(hash);
    }
    if (isAdmin && actif !== undefined) { fields.push('actif = ?'); values.push(actif); }
    if (isAdmin && role)               { fields.push('role = ?');  values.push(role); }

    if (!fields.length) return res.status(400).json({ message: 'Aucun champ à modifier.' });
    values.push(targetId);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Utilisateur mis à jour.' });
  } catch (err) { next(err); }
};

module.exports = { getMe, listUsers, updateUser };

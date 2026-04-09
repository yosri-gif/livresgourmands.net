const db = require('../db');

const listCategories = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY nom');
    res.json(rows);
  } catch (err) { next(err); }
};

const createCategorie = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const [r] = await db.query(
      'INSERT INTO categories (nom, description) VALUES (?, ?)', [nom, description || null]
    );
    res.status(201).json({ message: 'Catégorie créée.', id: r.insertId });
  } catch (err) { next(err); }
};

const updateCategorie = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const [r] = await db.query(
      'UPDATE categories SET nom = ?, description = ? WHERE id = ?',
      [nom, description || null, req.params.id]
    );
    if (!r.affectedRows) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json({ message: 'Catégorie mise à jour.' });
  } catch (err) { next(err); }
};

const deleteCategorie = async (req, res, next) => {
  try {
    const [r] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json({ message: 'Catégorie supprimée.' });
  } catch (err) { next(err); }
};

module.exports = { listCategories, createCategorie, updateCategorie, deleteCategorie };

const db = require('../db');

// GET /api/ouvrages  — public, stock > 0, filtres : search, categorie, sort
const listOuvrages = async (req, res, next) => {
  try {
    const { search, categorie, sort } = req.query;
    let sql = `
      SELECT o.*, c.nom AS categorie_nom,
             COALESCE(AVG(a.note), 0) AS note_moyenne,
             COUNT(a.id) AS nb_avis
      FROM ouvrages o
      LEFT JOIN categories  c ON o.categorie_id = c.id
      LEFT JOIN avis        a ON a.ouvrage_id   = o.id
      WHERE o.stock > 0`;
    const params = [];

    if (search) {
      sql += ' AND (o.titre LIKE ? OR o.auteur LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categorie) { sql += ' AND o.categorie_id = ?'; params.push(categorie); }

    sql += ' GROUP BY o.id';

    if (sort === 'popularite')  sql += ' ORDER BY nb_avis DESC, note_moyenne DESC';
    else if (sort === 'prix_asc')  sql += ' ORDER BY o.prix ASC';
    else if (sort === 'prix_desc') sql += ' ORDER BY o.prix DESC';
    else sql += ' ORDER BY o.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/ouvrages/:id  — public, inclut avis validés + commentaires validés
const getOuvrage = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, c.nom AS categorie_nom
       FROM ouvrages o LEFT JOIN categories c ON o.categorie_id = c.id
       WHERE o.id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Ouvrage introuvable.' });

    const [avis] = await db.query(
      `SELECT a.id, a.note, a.commentaire, a.date, u.nom AS auteur_nom
       FROM avis a JOIN users u ON a.client_id = u.id
       WHERE a.ouvrage_id = ? ORDER BY a.date DESC`, [req.params.id]
    );
    const [commentaires] = await db.query(
      `SELECT c.id, c.contenu, c.date_soumission, u.nom AS auteur_nom
       FROM commentaires c JOIN users u ON c.client_id = u.id
       WHERE c.ouvrage_id = ? AND c.valide = TRUE ORDER BY c.date_soumission DESC`,
      [req.params.id]
    );
    res.json({ ...rows[0], avis, commentaires });
  } catch (err) { next(err); }
};

// POST /api/ouvrages  — gestionnaire / editeur / admin
const createOuvrage = async (req, res, next) => {
  try {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES (?,?,?,?,?,?,?)',
      [titre, auteur, isbn || null, description || null, prix, stock, categorie_id || null]
    );
    res.status(201).json({ message: 'Ouvrage créé.', id: result.insertId });
  } catch (err) { next(err); }
};

// PUT /api/ouvrages/:id
const updateOuvrage = async (req, res, next) => {
  try {
    const fields = [], values = [];
    const allowed = ['titre','auteur','isbn','description','prix','stock','categorie_id'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) { fields.push(`${key} = ?`); values.push(req.body[key]); }
    }
    if (!fields.length) return res.status(400).json({ message: 'Aucun champ fourni.' });
    values.push(req.params.id);
    const [r] = await db.query(`UPDATE ouvrages SET ${fields.join(', ')} WHERE id = ?`, values);
    if (!r.affectedRows) return res.status(404).json({ message: 'Ouvrage introuvable.' });
    res.json({ message: 'Ouvrage mis à jour.' });
  } catch (err) { next(err); }
};

// DELETE /api/ouvrages/:id
const deleteOuvrage = async (req, res, next) => {
  try {
    const [r] = await db.query('DELETE FROM ouvrages WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ message: 'Ouvrage introuvable.' });
    res.json({ message: 'Ouvrage supprimé.' });
  } catch (err) { next(err); }
};

module.exports = { listOuvrages, getOuvrage, createOuvrage, updateOuvrage, deleteOuvrage };

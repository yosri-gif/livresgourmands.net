const db   = require('../db');
const { v4: uuidv4 } = require('uuid');

// POST /api/listes  — crée liste + génère code_partage unique
const createListe = async (req, res, next) => {
  try {
    const { nom } = req.body;
    const code    = uuidv4().replace(/-/g, '').substring(0, 16);
    const [r] = await db.query(
      'INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES (?, ?, ?)',
      [nom, req.user.id, code]
    );
    res.status(201).json({ message: 'Liste créée.', id: r.insertId, code_partage: code });
  } catch (err) { next(err); }
};

// GET /api/listes/:code  — public (accessible par un ami via le code)
const getListeByCode = async (req, res, next) => {
  try {
    const [listes] = await db.query(
      `SELECT l.*, u.nom AS proprietaire_nom
       FROM listes_cadeaux l JOIN users u ON l.proprietaire_id = u.id
       WHERE l.code_partage = ?`, [req.params.code]
    );
    if (!listes.length) return res.status(404).json({ message: 'Liste introuvable.' });

    const [items] = await db.query(
      `SELECT li.id, li.quantite_souhaitee, o.id AS ouvrage_id,
              o.titre, o.auteur, o.prix, o.stock
       FROM liste_items li JOIN ouvrages o ON li.ouvrage_id = o.id
       WHERE li.liste_id = ?`, [listes[0].id]
    );
    res.json({ ...listes[0], items });
  } catch (err) { next(err); }
};

// POST /api/listes/:id/items  — propriétaire uniquement
const addItemToListe = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite_souhaitee } = req.body;
    const [listes] = await db.query(
      'SELECT id FROM listes_cadeaux WHERE id = ? AND proprietaire_id = ?',
      [req.params.id, req.user.id]
    );
    if (!listes.length) return res.status(403).json({ message: 'Accès refusé ou liste introuvable.' });

    await db.query(
      'INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES (?, ?, ?)',
      [req.params.id, ouvrage_id, quantite_souhaitee || 1]
    );
    res.status(201).json({ message: 'Ouvrage ajouté à la liste.' });
  } catch (err) { next(err); }
};

// POST /api/listes/:id/acheter  — achat direct depuis une liste (simulation)
const acheterDepuisListe = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite } = req.body;
    const [ouv] = await db.query('SELECT * FROM ouvrages WHERE id = ?', [ouvrage_id]);
    if (!ouv.length) return res.status(404).json({ message: 'Ouvrage introuvable.' });
    if (ouv[0].stock < (quantite || 1)) {
      return res.status(400).json({ message: 'Stock insuffisant.' });
    }
    res.json({
      message: 'Ouvrage prêt à être acheté depuis la liste cadeau.',
      ouvrage: { id: ouv[0].id, titre: ouv[0].titre, prix: ouv[0].prix },
      prochaine_etape: 'Ajoutez cet ouvrage au panier via POST /api/panier/items puis passez la commande.',
    });
  } catch (err) { next(err); }
};

module.exports = { createListe, getListeByCode, addItemToListe, acheterDepuisListe };

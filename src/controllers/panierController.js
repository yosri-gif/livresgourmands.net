const db = require('../db');

/** Récupère le panier actif du client, ou en crée un nouveau. */
const getOrCreatePanier = async (clientId) => {
  const [rows] = await db.query(
    'SELECT id FROM panier WHERE client_id = ? AND actif = TRUE ORDER BY updated_at DESC LIMIT 1',
    [clientId]
  );
  if (rows.length) return rows[0].id;
  const [r] = await db.query('INSERT INTO panier (client_id) VALUES (?)', [clientId]);
  return r.insertId;
};

// GET /api/panier
const getPanier = async (req, res, next) => {
  try {
    const panierId = await getOrCreatePanier(req.user.id);
    const [items] = await db.query(
      `SELECT pi.id, pi.quantite, pi.prix_unitaire,
              o.id AS ouvrage_id, o.titre, o.auteur, o.stock
       FROM panier_items pi
       JOIN ouvrages o ON pi.ouvrage_id = o.id
       WHERE pi.panier_id = ?`, [panierId]
    );
    const total = items.reduce((s, i) => s + i.quantite * i.prix_unitaire, 0);
    res.json({ panier_id: panierId, items, total: parseFloat(total.toFixed(2)) });
  } catch (err) { next(err); }
};

// POST /api/panier/items
const addItem = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite } = req.body;
    const [ouv] = await db.query('SELECT * FROM ouvrages WHERE id = ?', [ouvrage_id]);
    if (!ouv.length) return res.status(404).json({ message: 'Ouvrage introuvable.' });

    const panierId = await getOrCreatePanier(req.user.id);
    const [exist]  = await db.query(
      'SELECT id, quantite FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
      [panierId, ouvrage_id]
    );

    const newQty = (exist.length ? exist[0].quantite : 0) + quantite;
    if (ouv[0].stock < newQty) return res.status(400).json({ message: 'Stock insuffisant.' });

    if (exist.length) {
      await db.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [newQty, exist[0].id]);
    } else {
      await db.query(
        'INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)',
        [panierId, ouvrage_id, quantite, ouv[0].prix]
      );
    }
    res.status(201).json({ message: 'Article ajouté au panier.' });
  } catch (err) { next(err); }
};

// PUT /api/panier/items/:id
const updateItem = async (req, res, next) => {
  try {
    const { quantite } = req.body;
    const [rows] = await db.query(
      `SELECT pi.id, o.stock FROM panier_items pi
       JOIN panier   p ON pi.panier_id  = p.id
       JOIN ouvrages o ON pi.ouvrage_id = o.id
       WHERE pi.id = ? AND p.client_id = ?`, [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Article introuvable dans le panier.' });
    if (rows[0].stock < quantite) return res.status(400).json({ message: 'Stock insuffisant.' });
    await db.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [quantite, req.params.id]);
    res.json({ message: 'Quantité mise à jour.' });
  } catch (err) { next(err); }
};

// DELETE /api/panier/items/:id
const removeItem = async (req, res, next) => {
  try {
    const [r] = await db.query(
      `DELETE pi FROM panier_items pi
       JOIN panier p ON pi.panier_id = p.id
       WHERE pi.id = ? AND p.client_id = ?`, [req.params.id, req.user.id]
    );
    if (!r.affectedRows) return res.status(404).json({ message: 'Article introuvable.' });
    res.json({ message: 'Article retiré du panier.' });
  } catch (err) { next(err); }
};

module.exports = { getPanier, addItem, updateItem, removeItem };

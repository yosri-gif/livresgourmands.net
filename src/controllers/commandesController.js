const db = require('../db');

// POST /api/commandes  — transactionnel : crée commande + décrémente stock
const createCommande = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { adresse_livraison, mode_livraison, mode_paiement } = req.body;
    const clientId = req.user.id;

    // Récupérer le panier actif
    const [paniers] = await conn.query(
      'SELECT id FROM panier WHERE client_id = ? AND actif = TRUE LIMIT 1', [clientId]
    );
    if (!paniers.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'Aucun panier actif trouvé.' });
    }
    const panierId = paniers[0].id;

    const [items] = await conn.query(
      `SELECT pi.ouvrage_id, pi.quantite, pi.prix_unitaire,
              o.stock, o.titre
       FROM panier_items pi
       JOIN ouvrages o ON pi.ouvrage_id = o.id
       WHERE pi.panier_id = ?`, [panierId]
    );
    if (!items.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'Le panier est vide.' });
    }

    // Vérifier stock pour chaque item
    for (const item of items) {
      if (item.stock < item.quantite) {
        await conn.rollback();
        return res.status(400).json({
          message: `Stock insuffisant pour : "${item.titre}". Disponible : ${item.stock}.`,
        });
      }
    }

    const total = items.reduce((s, i) => s + i.quantite * i.prix_unitaire, 0);

    // Créer la commande
    const [cmd] = await conn.query(
      `INSERT INTO commandes (client_id, total, adresse_livraison, mode_livraison, mode_paiement)
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, total, adresse_livraison, mode_livraison || null, mode_paiement || null]
    );
    const commandeId = cmd.insertId;

    // Insérer les items et décrémenter le stock
    for (const item of items) {
      await conn.query(
        'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)',
        [commandeId, item.ouvrage_id, item.quantite, item.prix_unitaire]
      );
      await conn.query(
        'UPDATE ouvrages SET stock = stock - ? WHERE id = ?',
        [item.quantite, item.ouvrage_id]
      );
    }

    // Désactiver le panier
    await conn.query('UPDATE panier SET actif = FALSE WHERE id = ?', [panierId]);

    await conn.commit();
    res.status(201).json({
      message: 'Commande créée avec succès.',
      commande_id: commandeId,
      total: parseFloat(total.toFixed(2)),
      simulation_paiement_url: `/api/commandes/${commandeId}`,
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// GET /api/commandes
const listCommandes = async (req, res, next) => {
  try {
    const isAdmin = ['administrateur', 'gestionnaire'].includes(req.user.role);
    let sql = 'SELECT * FROM commandes';
    const params = [];
    if (!isAdmin) { sql += ' WHERE client_id = ?'; params.push(req.user.id); }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/commandes/:id
const getCommande = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM commandes WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Commande introuvable.' });
    const commande = rows[0];
    const isOwner = commande.client_id === req.user.id;
    const isAdmin = ['administrateur', 'gestionnaire'].includes(req.user.role);
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Accès refusé.' });

    const [items] = await db.query(
      `SELECT ci.*, o.titre, o.auteur FROM commande_items ci
       JOIN ouvrages o ON ci.ouvrage_id = o.id
       WHERE ci.commande_id = ?`, [req.params.id]
    );
    res.json({ ...commande, items });
  } catch (err) { next(err); }
};

// PUT /api/commandes/:id/status
const updateStatut = async (req, res, next) => {
  try {
    const { statut } = req.body;
    const valides = ['en_cours', 'payee', 'annulee', 'expediee'];
    if (!valides.includes(statut)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${valides.join(', ')}.` });
    }
    const [r] = await db.query('UPDATE commandes SET statut = ? WHERE id = ?', [statut, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ message: 'Commande introuvable.' });
    res.json({ message: 'Statut mis à jour.' });
  } catch (err) { next(err); }
};

module.exports = { createCommande, listCommandes, getCommande, updateStatut };

const db = require('../db');

// POST /api/ouvrages/:id/avis  — vérifie que le client a acheté l'ouvrage
const addAvis = async (req, res, next) => {
  try {
    const ouvrageId = req.params.id;
    const clientId  = req.user.id;
    const { note, commentaire } = req.body;

    // Règle métier : le client doit avoir une commande PAYÉE contenant cet ouvrage
    const [achats] = await db.query(
      `SELECT ci.id FROM commande_items ci
       JOIN commandes c ON ci.commande_id = c.id
       WHERE c.client_id = ? AND ci.ouvrage_id = ? AND c.statut = 'payee'
       LIMIT 1`,
      [clientId, ouvrageId]
    );
    if (!achats.length) {
      return res.status(403).json({
        message: 'Vous devez avoir acheté cet ouvrage pour pouvoir laisser un avis.',
      });
    }

    await db.query(
      'INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?, ?, ?, ?)',
      [clientId, ouvrageId, note, commentaire || null]
    );
    res.status(201).json({ message: 'Avis ajouté avec succès.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Vous avez déjà laissé un avis pour cet ouvrage.' });
    }
    next(err);
  }
};

// POST /api/ouvrages/:id/commentaires  — valide = false par défaut
const addCommentaire = async (req, res, next) => {
  try {
    const { contenu } = req.body;
    const [r] = await db.query(
      'INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide) VALUES (?, ?, ?, FALSE)',
      [req.user.id, req.params.id, contenu]
    );
    res.status(201).json({
      message: 'Commentaire soumis. Il sera visible après validation par un éditeur.',
      id: r.insertId,
    });
  } catch (err) { next(err); }
};

// GET /api/commentaires/pending  — éditeur / admin
const pendingCommentaires = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.contenu, c.date_soumission,
              u.nom  AS auteur_nom,
              o.titre AS ouvrage_titre
       FROM commentaires c
       JOIN users    u ON c.client_id  = u.id
       JOIN ouvrages o ON c.ouvrage_id = o.id
       WHERE c.valide = FALSE
       ORDER BY c.date_soumission ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PUT /api/commentaires/:id/valider  — éditeur / admin  { action: "valider"|"rejeter" }
const validerCommentaire = async (req, res, next) => {
  try {
    const { action } = req.body;
    if (!['valider', 'rejeter'].includes(action)) {
      return res.status(400).json({ message: "Action invalide. Utilisez 'valider' ou 'rejeter'." });
    }
    if (action === 'valider') {
      const [r] = await db.query(
        'UPDATE commentaires SET valide = TRUE, date_validation = NOW(), valide_par = ? WHERE id = ?',
        [req.user.id, req.params.id]
      );
      if (!r.affectedRows) return res.status(404).json({ message: 'Commentaire introuvable.' });
      return res.json({ message: 'Commentaire validé et publié.' });
    } else {
      const [r] = await db.query('DELETE FROM commentaires WHERE id = ?', [req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ message: 'Commentaire introuvable.' });
      return res.json({ message: 'Commentaire rejeté et supprimé.' });
    }
  } catch (err) { next(err); }
};

module.exports = { addAvis, addCommentaire, pendingCommentaires, validerCommentaire };

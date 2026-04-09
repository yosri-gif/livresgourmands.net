/**
 * Gestionnaire d'erreurs centralisé — doit être enregistré en dernier dans app.js
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERREUR] ${err.message}`);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Doublon : cette entrée existe déjà.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ message: 'Référence invalide (clé étrangère introuvable).' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur.',
  });
};

module.exports = errorHandler;

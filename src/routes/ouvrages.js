const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate, ouvrageSchema, ouvrageUpdateSchema, avisSchema, commentaireSchema } = require('../validators');
const { listOuvrages, getOuvrage, createOuvrage, updateOuvrage, deleteOuvrage } = require('../controllers/ouvragesController');
const { addAvis, addCommentaire } = require('../controllers/avisController');

// Ouvrages CRUD
router.get('/',    listOuvrages);
router.get('/:id', getOuvrage);
router.post('/',
  authenticate,
  authorize('gestionnaire', 'editeur', 'administrateur'),
  validate(ouvrageSchema),
  createOuvrage
);
router.put('/:id',
  authenticate,
  authorize('gestionnaire', 'editeur', 'administrateur'),
  validate(ouvrageUpdateSchema),
  updateOuvrage
);
router.delete('/:id',
  authenticate,
  authorize('gestionnaire', 'administrateur'),
  deleteOuvrage
);

// Avis et commentaires sur un ouvrage
router.post('/:id/avis',
  authenticate,
  validate(avisSchema),
  addAvis
);
router.post('/:id/commentaires',
  authenticate,
  validate(commentaireSchema),
  addCommentaire
);

module.exports = router;

const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate, commandeSchema } = require('../validators');
const { createCommande, listCommandes, getCommande, updateStatut } = require('../controllers/commandesController');

router.post('/',            authenticate, validate(commandeSchema), createCommande);
router.get('/',             authenticate, listCommandes);
router.get('/:id',          authenticate, getCommande);
router.put('/:id/status',   authenticate, authorize('gestionnaire', 'administrateur'), updateStatut);

module.exports = router;

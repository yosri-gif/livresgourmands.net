const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { pendingCommentaires, validerCommentaire } = require('../controllers/avisController');

router.get('/pending',       authenticate, authorize('editeur', 'administrateur'), pendingCommentaires);
router.put('/:id/valider',   authenticate, authorize('editeur', 'administrateur'), validerCommentaire);

module.exports = router;

const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate, categorieSchema } = require('../validators');
const { listCategories, createCategorie, updateCategorie, deleteCategorie } = require('../controllers/categoriesController');

router.get('/',    listCategories);
router.post('/',   authenticate, authorize('editeur', 'gestionnaire', 'administrateur'), validate(categorieSchema), createCategorie);
router.put('/:id', authenticate, authorize('editeur', 'gestionnaire', 'administrateur'), validate(categorieSchema), updateCategorie);
router.delete('/:id', authenticate, authorize('gestionnaire', 'administrateur'), deleteCategorie);

module.exports = router;

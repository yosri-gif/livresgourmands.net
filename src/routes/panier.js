const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { validate, panierItemSchema, panierItemUpdateSchema } = require('../validators');
const { getPanier, addItem, updateItem, removeItem } = require('../controllers/panierController');

router.get('/',            authenticate, getPanier);
router.post('/items',      authenticate, validate(panierItemSchema),       addItem);
router.put('/items/:id',   authenticate, validate(panierItemUpdateSchema), updateItem);
router.delete('/items/:id', authenticate, removeItem);

module.exports = router;

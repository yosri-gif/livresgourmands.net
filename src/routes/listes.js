const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { validate, listeSchema, listeItemSchema } = require('../validators');
const { createListe, getListeByCode, addItemToListe, acheterDepuisListe } = require('../controllers/listesController');

router.post('/',              authenticate, validate(listeSchema),     createListe);
router.get('/:code',          getListeByCode);
router.post('/:id/items',     authenticate, validate(listeItemSchema), addItemToListe);
router.post('/:id/acheter',   authenticate, acheterDepuisListe);

module.exports = router;

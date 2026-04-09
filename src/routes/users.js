const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getMe, listUsers, updateUser } = require('../controllers/usersController');

router.get('/',     authenticate, authorize('administrateur'), listUsers);
router.get('/me',   authenticate, getMe);
router.put('/:id',  authenticate, updateUser);

module.exports = router;

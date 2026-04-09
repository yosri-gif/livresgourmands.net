const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../validators');

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);

module.exports = router;

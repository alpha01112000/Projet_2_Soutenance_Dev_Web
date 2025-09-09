const express = require('express');
const router = express.Router();
const { registerUser, loginUser, validateRegister, validateLogin, me } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, me);

module.exports = router;

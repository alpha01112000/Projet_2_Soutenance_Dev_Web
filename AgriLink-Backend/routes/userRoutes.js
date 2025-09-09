const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { getMyProfile, getAllUsers } = require('../controllers/userController');

router.get('/me', protect, getMyProfile);
router.get('/', protect, role('admin'), getAllUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { sendMessage, validateMessage, getMyMessages, getMyMessagesCount, markAsRead } = require('../controllers/messageController');

router.post('/', protect, validateMessage, sendMessage);
router.get('/mine', protect, getMyMessages);
router.get('/count', protect, getMyMessagesCount);
router.put('/:id/read', protect, markAsRead);

module.exports = router;

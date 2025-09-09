const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { contactVendeur, validateContact, getMyContactsCount, getMyMessages } = require('../controllers/contactController');
const { submitContactForm, validateContactForm } = require('../controllers/contactFormController');

router.post('/', protect, validateContact, contactVendeur);
router.get('/me/count', protect, getMyContactsCount);
router.get('/mine', protect, getMyMessages);
router.post('/form', validateContactForm, submitContactForm);

module.exports = router;

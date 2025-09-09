const express = require('express');
const router = express.Router();
const { submitContactForm, validateContactForm } = require('../controllers/contactFormController');

router.post('/', validateContactForm, submitContactForm);

module.exports = router;

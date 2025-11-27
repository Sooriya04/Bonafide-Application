const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/download/:id', downloadController.downloadDocx);

module.exports = router;

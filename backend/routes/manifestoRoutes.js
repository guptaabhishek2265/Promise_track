const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { getManifestos, getManifestoById, uploadManifestoPDF, addManifestoText } = require('../controllers/manifestoController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', asyncHandler(getManifestos));
router.get('/:id', asyncHandler(getManifestoById));
router.post('/upload', protect, adminOnly, upload.single('pdf'), asyncHandler(uploadManifestoPDF));
router.post('/text', protect, adminOnly, asyncHandler(addManifestoText));

module.exports = router;

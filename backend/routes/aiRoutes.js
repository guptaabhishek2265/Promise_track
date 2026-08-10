const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { chat, askManifesto, extractPromises, analyzePromise, compareManifestos } = require('../controllers/aiController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/chat', asyncHandler(chat)); 
router.post('/ask-manifesto', asyncHandler(askManifesto));
router.post('/extract-promises', protect, adminOnly, asyncHandler(extractPromises));
router.post('/analyze-promise', protect, asyncHandler(analyzePromise));
router.post('/compare-manifestos', asyncHandler(compareManifestos)); 

module.exports = router;

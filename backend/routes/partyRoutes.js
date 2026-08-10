const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { getParties, getPartyById, createParty, updateParty, deleteParty, compareParties } = require('../controllers/partyController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', asyncHandler(getParties));
router.get('/compare', asyncHandler(compareParties));
router.get('/:id', asyncHandler(getPartyById));
router.post('/', protect, adminOnly, asyncHandler(createParty));
router.put('/:id', protect, adminOnly, asyncHandler(updateParty));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteParty));

module.exports = router;

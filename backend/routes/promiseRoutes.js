const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { getPromises, getPromiseById, createPromise, updatePromise, deletePromise, votePromise, getOverviewStats } = require('../controllers/promiseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', asyncHandler(getPromises));
router.get('/stats/overview', asyncHandler(getOverviewStats));
router.get('/:id', asyncHandler(getPromiseById));
router.post('/', protect, asyncHandler(createPromise));
router.put('/:id', protect, asyncHandler(updatePromise));
router.delete('/:id', protect, adminOnly, asyncHandler(deletePromise));
router.post('/:id/vote', protect, asyncHandler(votePromise));

module.exports = router;

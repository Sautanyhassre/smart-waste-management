const express = require('express');
const router = express.Router();
const { getBins, getBinById, createBin, updateBin, updateFillLevel, deleteBin } = require('../controllers/binController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBins);
router.get('/:id', getBinById);
router.post('/', authorize('admin'), createBin);
router.put('/:id', authorize('admin', 'staff'), updateBin);
router.patch('/:id/fill-level', authorize('admin', 'staff'), updateFillLevel);
router.delete('/:id', authorize('admin'), deleteBin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCollections, createCollection, updateCollectionStatus, deleteCollection } = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', authorize('admin', 'staff'), getCollections);
router.post('/', authorize('admin'), createCollection);
router.patch('/:id/status', authorize('admin', 'staff'), updateCollectionStatus);
router.delete('/:id', authorize('admin'), deleteCollection);

module.exports = router;

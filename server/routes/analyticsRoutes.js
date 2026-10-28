const express = require('express');
const router = express.Router();
const { getOverviewAnalytics, getWasteRecords } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverviewAnalytics);
router.get('/records', authorize('admin', 'staff'), getWasteRecords);

module.exports = router;

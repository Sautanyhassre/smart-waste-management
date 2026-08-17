const express = require('express');
const router = express.Router();
const { getOverviewAnalytics, getWasteRecords } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverviewAnalytics);
router.get('/records', getWasteRecords);

module.exports = router;

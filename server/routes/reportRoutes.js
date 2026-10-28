const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/generate', authorize('admin'), generateReport);

module.exports = router;

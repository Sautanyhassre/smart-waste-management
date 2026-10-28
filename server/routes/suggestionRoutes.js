const express = require('express');
const router = express.Router();
const {
  getSuggestions,
  createSuggestion,
  respondSuggestion
} = require('../controllers/suggestionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSuggestions);
router.post('/', createSuggestion);
router.patch('/:id/respond', authorize('admin'), respondSuggestion);

module.exports = router;

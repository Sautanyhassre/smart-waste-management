const express = require('express');
const router = express.Router();
const {
  getComplaints,
  createComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// Public or logged-in citizens can submit a complaint
router.post('/', createComplaint);

// Listing complaints & updating status can be done by authenticated users (or viewable by all in demo)
router.get('/', getComplaints);
router.patch('/:id/status', protect, updateComplaintStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  assignComplaint,
  updateWorkflowStatus,
  citizenAction
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all / scoped complaints
router.get('/', protect, getComplaints);

// Get single complaint details
router.get('/:id', protect, getComplaintById);

// Public / Citizen submit complaint
router.post('/', protect, createComplaint);

// Admin assignment & validation
router.patch('/:id/assign', protect, authorize('admin'), assignComplaint);

// Staff workflow status update
router.patch('/:id/workflow', protect, authorize('admin', 'staff'), updateWorkflowStatus);

// Citizen confirm or reopen
router.patch('/:id/citizen-action', protect, authorize('admin', 'viewer'), citizenAction);

module.exports = router;

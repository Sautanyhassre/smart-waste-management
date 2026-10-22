const express = require('express');
const router = express.Router();
const { register, login, getMe, getStaffUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/staff', protect, authorize('admin'), getStaffUsers);

module.exports = router;

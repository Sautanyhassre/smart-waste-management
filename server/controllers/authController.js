const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'smart_waste_management_secret_key_2026_cse_project',
    { expiresIn: '7d' }
  );
};

// @desc    Get all staff users (for admin assignment)
// @route   GET /api/auth/staff
exports.getStaffUsers = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff', status: 'Active' }).select('name email phone zone role status');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Register User
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, zone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
      phone,
      zone
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

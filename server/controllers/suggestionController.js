const Suggestion = require('../models/Suggestion');

// @desc    Get suggestions (Admin gets all, Viewer gets their own)
// @route   GET /api/suggestions
exports.getSuggestions = async (req, res, next) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'viewer') {
      query.$or = [
        { userId: req.user._id || req.user.id },
        { userEmail: req.user.email }
      ];
    }

    const suggestions = await Suggestion.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: suggestions.length, data: suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Create suggestion / feedback
// @route   POST /api/suggestions
exports.createSuggestion = async (req, res, next) => {
  try {
    const { userName, userEmail, userPhone, category, zone, location, title, suggestion, rating } = req.body;

    if (!title || !suggestion) {
      return res.status(400).json({ success: false, message: 'Please provide suggestion title and details' });
    }

    const count = await Suggestion.countDocuments();
    const suggestionId = `SUG-${String(count + 101).padStart(3, '0')}`;

    const newSuggestion = await Suggestion.create({
      suggestionId,
      userName: userName || req.user?.name || 'Citizen',
      userEmail: userEmail || req.user?.email || '',
      userPhone: userPhone || req.user?.phone || '',
      category: category || 'Cleanliness Improvement',
      zone: zone || 'Central Zone',
      location: location || '',
      title,
      suggestion,
      rating: rating || 5,
      userId: req.user ? (req.user._id || req.user.id) : undefined,
      status: 'Received'
    });

    res.status(201).json({
      success: true,
      data: newSuggestion,
      message: `Suggestion ${suggestionId} submitted successfully. Thank you for helping keep our city clean!`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin reviews & responds to suggestion
// @route   PATCH /api/suggestions/:id/respond
exports.respondSuggestion = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const item = await Suggestion.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Suggestion not found' });
    }

    if (status) item.status = status;
    if (adminResponse !== undefined) item.adminResponse = adminResponse;

    await item.save();
    res.status(200).json({ success: true, data: item, message: 'Suggestion status and response saved' });
  } catch (error) {
    next(error);
  }
};

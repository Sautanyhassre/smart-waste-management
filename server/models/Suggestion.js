const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  suggestionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  userName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  userPhone: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Bin Placement',
      'Collection Schedule',
      'Waste Segregation',
      'Cleanliness Improvement',
      'Recurring Hotspot',
      'Service Quality',
      'Other'
    ],
    default: 'Cleanliness Improvement'
  },
  zone: {
    type: String,
    enum: ['East Zone', 'South Zone', 'Central Zone', 'North Zone', 'West Zone', 'All Zones'],
    default: 'Central Zone'
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  suggestion: {
    type: String,
    required: [true, 'Suggestion text is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  status: {
    type: String,
    enum: ['Received', 'Under Review', 'Acted Upon', 'Closed'],
    default: 'Received',
    index: true
  },
  adminResponse: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Suggestion', suggestionSchema);

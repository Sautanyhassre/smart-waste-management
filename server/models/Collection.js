const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  collectionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  bin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteBin',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    default: '09:00 AM'
  },
  actualCollectionTime: {
    type: Date
  },
  quantityCollected: {
    type: Number, // in kg
    default: 0
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Assigned', 'In Progress', 'Completed', 'Delayed', 'Missed', 'Cancelled'],
    default: 'Scheduled',
    index: true
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);

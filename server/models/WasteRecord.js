const mongoose = require('mongoose');

const wasteRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    required: true,
    unique: true
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  },
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteBin'
  },
  category: {
    type: String,
    enum: ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass', 'E-waste', 'Mixed'],
    required: true
  },
  quantity: {
    type: Number, // in kg
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  zone: {
    type: String,
    required: true
  },
  collectionDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);

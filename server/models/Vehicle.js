const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['Compactor Truck', 'Mini Tipper', 'Hook Loader', 'Electric Cart'],
    default: 'Compactor Truck'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  capacity: {
    type: Number, // in tons
    default: 5.0
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'Collecting', 'Maintenance', 'Inactive'],
    default: 'Available',
    index: true
  },
  currentLocation: {
    type: String,
    default: 'Central Depot'
  },
  lastServiceDate: {
    type: Date
  },
  nextServiceDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

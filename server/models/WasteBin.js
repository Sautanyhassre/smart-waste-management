const mongoose = require('mongoose');

const wasteBinSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  zone: {
    type: String,
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  binType: {
    type: String,
    enum: ['Standard', 'Recycle', 'Hazardous', 'Compost', 'Smart Solar'],
    default: 'Standard'
  },
  wasteCategory: {
    type: String,
    enum: ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass', 'E-waste', 'Mixed'],
    default: 'Mixed'
  },
  capacity: {
    type: Number,
    default: 240 // in liters
  },
  fillLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High', 'Critical'],
    default: 'Low',
    index: true
  },
  priorityScore: {
    type: Number,
    default: 0
  },
  priorityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  lastCollectedAt: {
    type: Date,
    default: Date.now
  },
  nextCollectionAt: {
    type: Date
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
}, {
  timestamps: true
});

wasteBinSchema.methods.calculateStatusAndPriority = function () {
  const fill = this.fillLevel;
  if (fill <= 25) this.status = 'Low';
  else if (fill <= 50) this.status = 'Moderate';
  else if (fill <= 75) this.status = 'High';
  else if (fill <= 90) this.status = 'Very High';
  else this.status = 'Critical';

  const now = new Date();
  const lastColl = this.lastCollectedAt ? new Date(this.lastCollectedAt) : new Date(now.getTime() - 24 * 3600 * 1000);
  const hoursElapsed = Math.max(0, (now.getTime() - lastColl.getTime()) / (1000 * 60 * 60));
  
  const criticalityBonus = fill > 90 ? 25 : fill > 75 ? 15 : 0;
  
  this.priorityScore = Math.min(100, Math.round((fill * 0.55) + (hoursElapsed * 0.3) + criticalityBonus));

  if (this.priorityScore >= 80) this.priorityLevel = 'Critical';
  else if (this.priorityScore >= 60) this.priorityLevel = 'High';
  else if (this.priorityScore >= 40) this.priorityLevel = 'Medium';
  else this.priorityLevel = 'Low';

  return this.status;
};

module.exports = mongoose.model('WasteBin', wasteBinSchema);

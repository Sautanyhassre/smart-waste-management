const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  reportType: {
    type: String,
    enum: ['Waste Collection Report', 'Bin Status Report', 'Vehicle Utilization Report', 'Analytics Summary Report'],
    required: true
  },
  generatedBy: {
    type: String,
    default: 'System Admin'
  },
  dateRange: {
    startDate: Date,
    endDate: Date
  },
  filters: {
    zone: String,
    wasteCategory: String,
    status: String
  },
  summaryMetrics: {
    totalWasteCollected: Number,
    collectionEfficiency: Number,
    overflowRate: Number,
    activeBinsCount: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  userName: {
    type: String,
    required: [true, 'Citizen/User name is required'],
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
  issueType: {
    type: String,
    required: [true, 'Complaint issue type is required'],
    enum: [
      'Overflowing Bin',
      'Damaged / Broken Bin',
      'Missed Waste Collection',
      'Foul Odor / Hazardous Waste',
      'Illegal Dumping',
      'Vehicle Spillage',
      'Other'
    ],
    default: 'Overflowing Bin'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  zone: {
    type: String,
    required: [true, 'Municipal zone is required'],
    enum: ['East Zone', 'South Zone', 'Central Zone', 'North Zone', 'West Zone'],
    default: 'Central Zone'
  },
  location: {
    type: String,
    required: [true, 'Street or landmark location is required'],
    trim: true
  },
  binId: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Review', 'Assigned', 'Resolved', 'Rejected'],
    default: 'Submitted',
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);

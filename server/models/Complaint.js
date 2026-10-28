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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  photoUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Review', 'Assigned', 'Accepted', 'In Progress', 'Resolved', 'Rejected', 'Reopened'],
    default: 'Submitted',
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: {
    type: Date
  },
  expectedCollectionTime: {
    type: String,
    default: 'Awaiting schedule confirmation'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  resolutionEvidenceUrl: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date
  },
  reopenReason: {
    type: String,
    default: ''
  },
  reopenedAt: {
    type: Date
  },
  citizenFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' },
    isConfirmedResolved: { type: Boolean, default: false },
    submittedAt: { type: Date }
  },
  activityLog: [{
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    role: { type: String, default: 'system' },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);

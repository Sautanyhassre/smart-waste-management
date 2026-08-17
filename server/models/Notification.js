const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'high', 'critical'],
    default: 'info'
  },
  type: {
    type: String,
    enum: ['overflow', 'delay', 'missed', 'maintenance', 'system'],
    default: 'system'
  },
  relatedEntity: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);

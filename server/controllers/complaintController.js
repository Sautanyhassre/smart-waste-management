const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get complaints (Role-scoped: Admin sees all, Staff sees assigned, Viewer sees their own)
// @route   GET /api/complaints
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, zone, issueType, search, myComplaints } = req.query;
    let query = {};

    // Role-based scoping
    if (req.user) {
      if (req.user.role === 'viewer' || myComplaints === 'true') {
        // Scoped to the logged-in viewer by email or user id
        query.$or = [
          { userId: req.user._id || req.user.id },
          { userEmail: req.user.email }
        ];
      } else if (req.user.role === 'staff') {
        // Staff sees tasks assigned to them, or open in their zone
        query.$or = [
          { assignedTo: req.user._id || req.user.id },
          { zone: req.user.zone !== 'All Zones' ? req.user.zone : { $exists: true } }
        ];
      }
    }

    if (status && status !== 'All') query.status = status;
    if (zone && zone !== 'All') query.zone = zone;
    if (issueType && issueType !== 'All') query.issueType = issueType;

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchCondition = [
        { complaintId: searchRegex },
        { location: searchRegex },
        { userName: searchRegex },
        { binId: searchRegex },
        { description: searchRegex }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchCondition }];
        delete query.$or;
      } else {
        query.$or = searchCondition;
      }
    }

    const complaints = await Complaint.find(query)
      .populate('assignedTo', 'name email phone zone role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID with full tracking details
// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assignedTo', 'name email phone zone role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role-based access check
    if (req.user && req.user.role === 'viewer') {
      const isOwner = (complaint.userId && complaint.userId.toString() === req.user.id) ||
                      (complaint.userEmail && complaint.userEmail.toLowerCase() === req.user.email.toLowerCase());
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to view another citizen\'s private complaint' });
      }
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new complaint (Viewer / Citizen submission with photo)
// @route   POST /api/complaints
exports.createComplaint = async (req, res, next) => {
  try {
    const {
      userName,
      userEmail,
      userPhone,
      issueType,
      priority,
      zone,
      location,
      binId,
      description,
      photoUrl
    } = req.body;

    if (!userName || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide citizen name, location landmark, and issue description.'
      });
    }

    const count = await Complaint.countDocuments();
    const complaintId = `CMP-${String(count + 2001).padStart(4, '0')}`;

    const complaint = await Complaint.create({
      complaintId,
      userName,
      userEmail: userEmail || req.user?.email || '',
      userPhone: userPhone || req.user?.phone || '',
      userId: req.user ? (req.user._id || req.user.id) : undefined,
      issueType: issueType || 'Overflowing Bin',
      priority: priority || 'Medium',
      zone: zone || 'Central Zone',
      location,
      binId: binId || '',
      description,
      photoUrl: photoUrl || '',
      status: 'Submitted',
      activityLog: [{
        action: 'Complaint Submitted',
        performedBy: userName,
        role: req.user?.role || 'viewer',
        notes: `Citizen registered complaint regarding "${issueType}" at ${location}`
      }]
    });

    // Notify administrators and supervisors
    try {
      await Notification.create({
        title: `New Citizen Grievance: ${complaintId}`,
        message: `${userName} reported ${issueType} at ${location} (${zone}).`,
        severity: priority === 'Critical' || priority === 'High' ? 'critical' : 'warning',
        type: 'system',
        relatedEntity: complaintId
      });
    } catch (notifErr) {
      console.warn('Notification log skipped:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: complaint,
      message: `Complaint ${complaintId} successfully registered with municipal dispatch.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin assigns / validates complaint
// @route   PATCH /api/complaints/:id/assign
exports.assignComplaint = async (req, res, next) => {
  try {
    const { assignedTo, priority, expectedCollectionTime, adminRemarks, status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    let staffUser = null;
    if (assignedTo) {
      staffUser = await User.findById(assignedTo);
      if (!staffUser) {
        return res.status(404).json({ success: false, message: 'Assigned staff user not found' });
      }
      complaint.assignedTo = staffUser._id;
      complaint.assignedDate = new Date();
      complaint.status = status || 'Assigned';
    }

    if (priority) complaint.priority = priority;
    if (expectedCollectionTime) complaint.expectedCollectionTime = expectedCollectionTime;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;
    if (status && !assignedTo) complaint.status = status;

    complaint.activityLog.push({
      action: staffUser ? `Assigned to ${staffUser.name}` : `Status updated to ${complaint.status}`,
      performedBy: req.user?.name || 'Administrator',
      role: 'admin',
      notes: adminRemarks || (staffUser ? `Assigned for route dispatch. Expected time: ${expectedCollectionTime || 'Confirmed schedule'}` : '')
    });

    await complaint.save();

    // Create notification for staff
    if (staffUser) {
      try {
        await Notification.create({
          title: `New Task Assigned: ${complaint.complaintId}`,
          message: `You have been assigned to inspect/clear ${complaint.issueType} at ${complaint.location}.`,
          severity: 'info',
          type: 'system',
          relatedEntity: complaint.complaintId
        });
      } catch (err) {}
    }

    res.status(200).json({ success: true, data: complaint, message: 'Complaint updated and staff assigned' });
  } catch (error) {
    next(error);
  }
};

// @desc    Staff updates workflow status (Accepted -> In Progress -> Resolved / Blocked)
// @route   PATCH /api/complaints/:id/workflow
exports.updateWorkflowStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, resolutionEvidenceUrl, reason } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role check: Only admin or the assigned staff member can execute workflow steps
    if (req.user && req.user.role === 'staff') {
      const isAssigned = complaint.assignedTo && complaint.assignedTo.toString() === req.user.id;
      if (!isAssigned) {
        // Allow if same zone
        if (complaint.zone !== req.user.zone && req.user.zone !== 'All Zones') {
          return res.status(403).json({ success: false, message: 'You are not assigned to this complaint' });
        }
      }
    }

    const previousStatus = complaint.status;
    if (status) complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
    if (resolutionEvidenceUrl) complaint.resolutionEvidenceUrl = resolutionEvidenceUrl;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    complaint.activityLog.push({
      action: `Status changed from ${previousStatus} to ${status}`,
      performedBy: req.user?.name || 'Field Staff',
      role: req.user?.role || 'staff',
      notes: resolutionNotes || reason || ''
    });

    await complaint.save();

    // Create notification for citizen
    try {
      await Notification.create({
        title: `Complaint ${complaint.complaintId}: ${status}`,
        message: `Your complaint at ${complaint.location} is now ${status}. ${resolutionNotes ? 'Notes: ' + resolutionNotes : ''}`,
        severity: status === 'Resolved' ? 'info' : 'warning',
        type: 'system',
        relatedEntity: complaint.complaintId
      });
    } catch (e) {}

    res.status(200).json({ success: true, data: complaint, message: `Complaint status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// @desc    Citizen feedback & resolution confirmation or reopen
// @route   PATCH /api/complaints/:id/citizen-action
exports.citizenAction = async (req, res, next) => {
  try {
    const { action, rating, comment, reopenReason } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (action === 'confirm_resolved') {
      complaint.citizenFeedback = {
        rating: rating || 5,
        comment: comment || 'Issue resolved to satisfaction.',
        isConfirmedResolved: true,
        submittedAt: new Date()
      };
      complaint.activityLog.push({
        action: 'Citizen Confirmed Resolution',
        performedBy: req.user?.name || complaint.userName,
        role: 'viewer',
        notes: `Citizen submitted ${rating || 5}-star rating: "${comment || 'Resolved'}"`
      });
    } else if (action === 'reopen') {
      complaint.status = 'Reopened';
      complaint.reopenReason = reopenReason || 'Citizen reported issue is still not resolved';
      complaint.reopenedAt = new Date();
      complaint.activityLog.push({
        action: 'Complaint Reopened by Citizen',
        performedBy: req.user?.name || complaint.userName,
        role: 'viewer',
        notes: `Reopen reason: ${reopenReason || 'Problem persists on site'}`
      });
    }

    await complaint.save();

    res.status(200).json({ success: true, data: complaint, message: 'Citizen action recorded successfully' });
  } catch (error) {
    next(error);
  }
};

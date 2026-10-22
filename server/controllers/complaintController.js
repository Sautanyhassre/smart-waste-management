const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Get all complaints (with optional status & zone filtering)
// @route   GET /api/complaints
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, zone, issueType, search } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (zone && zone !== 'All') query.zone = zone;
    if (issueType && issueType !== 'All') query.issueType = issueType;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { binId: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('assignedTo', 'name email phone')
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

// @desc    Create a new complaint (public/user form)
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
      description
    } = req.body;

    if (!userName || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide citizen name, location, and issue description.'
      });
    }

    const count = await Complaint.countDocuments();
    const complaintId = `CMP-${String(count + 1001).padStart(4, '0')}`;

    const complaint = await Complaint.create({
      complaintId,
      userName,
      userEmail: userEmail || req.user?.email || '',
      userPhone: userPhone || req.user?.phone || '',
      issueType: issueType || 'Overflowing Bin',
      priority: priority || 'Medium',
      zone: zone || 'Central Zone',
      location,
      binId: binId || '',
      description,
      status: 'Submitted'
    });

    // Create system notification for admins & staff
    try {
      await Notification.create({
        title: `New Citizen Complaint: ${complaintId}`,
        message: `${userName} logged complaint regarding "${issueType}" at ${location} (${zone}).`,
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
      message: 'Complaint successfully submitted and registered with municipal dispatch.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status or add resolution notes
// @route   PATCH /api/complaints/:id/status
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
    if (assignedTo) complaint.assignedTo = assignedTo;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      data: complaint,
      message: `Complaint ${complaint.complaintId} status updated to ${complaint.status}`
    });
  } catch (error) {
    next(error);
  }
};

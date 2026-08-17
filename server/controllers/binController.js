const WasteBin = require('../models/WasteBin');
const Notification = require('../models/Notification');
const { calculateBinPriority } = require('../utils/priorityEngine');

// @desc    Get all bins with filters
// @route   GET /api/bins
exports.getBins = async (req, res, next) => {
  try {
    const { zone, status, category, search, priority } = req.query;
    let query = {};

    if (zone && zone !== 'All') query.zone = zone;
    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.wasteCategory = category;
    if (priority && priority !== 'All') query.priorityLevel = priority;

    if (search) {
      query.$or = [
        { binId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { zone: { $regex: search, $options: 'i' } }
      ];
    }

    const bins = await WasteBin.find(query).populate('assignedVehicle', 'vehicleId registrationNumber driver').sort({ priorityScore: -1 });

    // Recalculate dynamic values
    bins.forEach(bin => bin.calculateStatusAndPriority());

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bin
// @route   GET /api/bins/:id
exports.getBinById = async (req, res, next) => {
  try {
    const bin = await WasteBin.findById(req.params.id).populate('assignedVehicle');
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Waste bin not found' });
    }
    bin.calculateStatusAndPriority();
    res.status(200).json({ success: true, data: bin });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new waste bin
// @route   POST /api/bins
exports.createBin = async (req, res, next) => {
  try {
    const existing = await WasteBin.findOne({ binId: req.body.binId });
    if (existing) {
      return res.status(400).json({ success: false, message: `Bin ID '${req.body.binId}' already exists` });
    }

    const bin = new WasteBin(req.body);
    bin.calculateStatusAndPriority();
    await bin.save();

    if (bin.fillLevel >= 75) {
      await Notification.create({
        title: `Bin ${bin.binId} High Capacity Alert`,
        message: `Bin ${bin.binId} at ${bin.location} is at ${bin.fillLevel}% capacity.`,
        severity: bin.fillLevel >= 90 ? 'critical' : 'warning',
        type: 'overflow',
        relatedEntity: bin.binId
      });
    }

    res.status(201).json({ success: true, data: bin });
  } catch (error) {
    next(error);
  }
};

// @desc    Update waste bin
// @route   PUT /api/bins/:id
exports.updateBin = async (req, res, next) => {
  try {
    let bin = await WasteBin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Waste bin not found' });
    }

    Object.assign(bin, req.body);
    bin.calculateStatusAndPriority();
    await bin.save();

    res.status(200).json({ success: true, data: bin });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick Update Fill Level
// @route   PATCH /api/bins/:id/fill-level
exports.updateFillLevel = async (req, res, next) => {
  try {
    const { fillLevel } = req.body;
    if (fillLevel === undefined || fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({ success: false, message: 'Fill level must be between 0 and 100%' });
    }

    const bin = await WasteBin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Waste bin not found' });
    }

    const oldFill = bin.fillLevel;
    bin.fillLevel = fillLevel;
    bin.calculateStatusAndPriority();
    await bin.save();

    // Trigger Notification on threshold crossed
    if (fillLevel >= 75 && oldFill < 75) {
      await Notification.create({
        title: `Bin ${bin.binId} Capacity Warning`,
        message: `Bin ${bin.binId} (${bin.location}) has crossed 75% fill capacity (Now ${fillLevel}%).`,
        severity: fillLevel >= 90 ? 'critical' : 'warning',
        type: 'overflow',
        relatedEntity: bin.binId
      });
    } else if (fillLevel >= 90 && oldFill < 90) {
      await Notification.create({
        title: `CRITICAL: Bin ${bin.binId} Overflowing!`,
        message: `Bin ${bin.binId} (${bin.location}) is ${fillLevel}% full and requires immediate dispatch!`,
        severity: 'critical',
        type: 'overflow',
        relatedEntity: bin.binId
      });
    }

    res.status(200).json({ success: true, data: bin });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete waste bin
// @route   DELETE /api/bins/:id
exports.deleteBin = async (req, res, next) => {
  try {
    const bin = await WasteBin.findByIdAndDelete(req.params.id);
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Waste bin not found' });
    }
    res.status(200).json({ success: true, message: 'Bin deleted successfully' });
  } catch (error) {
    next(error);
  }
};

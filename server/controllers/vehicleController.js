const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
exports.getVehicles = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (type && type !== 'All') query.vehicleType = type;
    if (search) {
      query.$or = [
        { vehicleId: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { currentLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(query).populate('driver', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, vehicleId } = req.body;
    const existing = await Vehicle.findOne({ $or: [{ registrationNumber }, { vehicleId }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Vehicle ID or Registration Number already exists' });
    }

    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    next(error);
  }
};

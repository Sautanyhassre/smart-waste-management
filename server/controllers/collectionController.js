const Collection = require('../models/Collection');
const WasteBin = require('../models/WasteBin');
const Vehicle = require('../models/Vehicle');
const WasteRecord = require('../models/WasteRecord');
const Notification = require('../models/Notification');

// @desc    Get all collections
// @route   GET /api/collections
exports.getCollections = async (req, res, next) => {
  try {
    const { status, zone, vehicle, search, staffId, myTasks } = req.query;
    let query = {};

    // Staff filtering: if myTasks=true, only return collections assigned to the logged-in user
    if (myTasks === 'true' && req.user) {
      query.staff = req.user._id || req.user.id;
    } else if (staffId) {
      query.staff = staffId;
    }

    if (status && status !== 'All') query.status = status;

    const collections = await Collection.find(query)
      .populate('bin')
      .populate('vehicle')
      .populate('staff', 'name email role phone')
      .sort({ scheduledDate: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: collections.length, data: collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection
// @route   POST /api/collections
exports.createCollection = async (req, res, next) => {
  try {
    const { binId, vehicleId, staffId, scheduledDate, scheduledTime } = req.body;

    const bin = await WasteBin.findById(binId);
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    let vehicle;
    if (vehicleId) {
      vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }
      if (vehicle.status === 'Maintenance' || vehicle.status === 'Inactive') {
        return res.status(400).json({ success: false, message: `Vehicle ${vehicle.registrationNumber} is currently in Maintenance/Inactive status and cannot be assigned` });
      }
    }

    const collectionCount = await Collection.countDocuments();
    const collectionId = `COL-${String(collectionCount + 101).padStart(3, '0')}`;

    const collection = await Collection.create({
      collectionId,
      bin: bin._id,
      vehicle: vehicle ? vehicle._id : undefined,
      staff: staffId || req.user.id,
      scheduledDate: scheduledDate || new Date(),
      scheduledTime: scheduledTime || '10:00 AM',
      status: vehicle ? 'Assigned' : 'Scheduled'
    });

    if (vehicle) {
      vehicle.status = 'Assigned';
      await vehicle.save();
    }

    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection status / record completion
// @route   PATCH /api/collections/:id/status
exports.updateCollectionStatus = async (req, res, next) => {
  try {
    const { status, quantityCollected, remarks } = req.body;
    const collection = await Collection.findById(req.params.id)
      .populate('bin')
      .populate('vehicle');

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection task not found' });
    }

    collection.status = status || collection.status;
    if (remarks !== undefined) collection.remarks = remarks;

    if (status === 'Completed') {
      collection.actualCollectionTime = new Date();
      collection.quantityCollected = Number(quantityCollected) || 120;

      // Update Bin fill level & last collected date
      if (collection.bin) {
        const bin = await WasteBin.findById(collection.bin._id || collection.bin);
        if (bin) {
          bin.fillLevel = 0;
          bin.lastCollectedAt = new Date();
          bin.calculateStatusAndPriority();
          await bin.save();
        }

        // Create Waste Record log
        const recordCount = await WasteRecord.countDocuments();
        await WasteRecord.create({
          recordId: `WR-${String(recordCount + 1001).padStart(4, '0')}`,
          collectionId: collection._id,
          binId: bin ? bin._id : undefined,
          category: bin ? bin.wasteCategory : 'Mixed',
          quantity: collection.quantityCollected,
          unit: 'kg',
          zone: bin ? bin.zone : 'Central Zone',
          collectionDate: new Date(),
          vehicleId: collection.vehicle ? collection.vehicle._id : undefined,
          staffId: req.user.id
        });
      }

      // Update Vehicle Status back to Available
      if (collection.vehicle) {
        const vehicle = await Vehicle.findById(collection.vehicle._id || collection.vehicle);
        if (vehicle) {
          vehicle.status = 'Available';
          await vehicle.save();
        }
      }

      // Send System Notification
      await Notification.create({
        title: `Collection ${collection.collectionId} Completed`,
        message: `Task ${collection.collectionId} completed. ${collection.quantityCollected} kg of waste collected from ${collection.bin ? collection.bin.name : 'Bin'}.`,
        severity: 'info',
        type: 'system',
        relatedEntity: collection.collectionId
      });
    } else if (status === 'In Progress' && collection.vehicle) {
      const vehicle = await Vehicle.findById(collection.vehicle._id || collection.vehicle);
      if (vehicle) {
        vehicle.status = 'Collecting';
        await vehicle.save();
      }
    }

    await collection.save();
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection task
// @route   DELETE /api/collections/:id
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection task not found' });
    }
    res.status(200).json({ success: true, message: 'Collection task deleted' });
  } catch (error) {
    next(error);
  }
};

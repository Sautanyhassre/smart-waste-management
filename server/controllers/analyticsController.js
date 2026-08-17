const WasteBin = require('../models/WasteBin');
const Collection = require('../models/Collection');
const Vehicle = require('../models/Vehicle');
const WasteRecord = require('../models/WasteRecord');

// @desc    Get complete dashboard analytics
// @route   GET /api/analytics/overview
exports.getOverviewAnalytics = async (req, res, next) => {
  try {
    const bins = await WasteBin.find();
    const collections = await Collection.find();
    const vehicles = await Vehicle.find();
    const records = await WasteRecord.find();

    // Recalculate statuses
    bins.forEach(b => b.calculateStatusAndPriority());

    const totalBins = bins.length;
    const activeBins = bins.filter(b => b.status !== 'Inactive').length;
    const overflowingBins = bins.filter(b => b.fillLevel > 90).length;
    const requiringAttentionBins = bins.filter(b => b.fillLevel >= 75).length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCollections = collections.filter(c => {
      const d = c.scheduledDate ? new Date(c.scheduledDate).toISOString().split('T')[0] : '';
      return d === todayStr;
    });

    const completedCollections = collections.filter(c => c.status === 'Completed').length;
    const pendingCollections = collections.filter(c => ['Scheduled', 'Assigned', 'In Progress'].includes(c.status)).length;

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const vehiclesCurrentlyCollecting = vehicles.filter(v => ['Collecting', 'Assigned'].includes(v.status)).length;

    const totalWasteCollectedKg = records.reduce((acc, r) => acc + (r.quantity || 0), 0);
    const collectionEfficiency = collections.length > 0 
      ? Math.round((completedCollections / collections.length) * 100) 
      : 85;

    // Waste Category Distribution
    const categoryCounts = {};
    records.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + r.quantity;
    });

    const wasteCategoryDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      quantity: categoryCounts[cat]
    }));

    // Bin Status Distribution
    const statusDistribution = {
      Empty: bins.filter(b => b.fillLevel <= 25).length,
      Moderate: bins.filter(b => b.fillLevel > 25 && b.fillLevel <= 50).length,
      High: bins.filter(b => b.fillLevel > 50 && b.fillLevel <= 75).length,
      VeryHigh: bins.filter(b => b.fillLevel > 75 && b.fillLevel <= 90).length,
      Critical: bins.filter(b => b.fillLevel > 90).length
    };

    // Collection Performance
    const collectionPerformance = {
      Completed: collections.filter(c => c.status === 'Completed').length,
      Pending: collections.filter(c => ['Scheduled', 'Assigned', 'In Progress'].includes(c.status)).length,
      Missed: collections.filter(c => c.status === 'Missed').length,
      Delayed: collections.filter(c => c.status === 'Delayed').length
    };

    // Area-wise Generation
    const areaCounts = {};
    records.forEach(r => {
      areaCounts[r.zone] = (areaCounts[r.zone] || 0) + r.quantity;
    });
    const areaWiseWaste = Object.keys(areaCounts).map(zone => ({
      zone,
      quantity: areaCounts[zone]
    }));

    // Collection Trend (Last 7 Days)
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      trendMap[key] = 0;
    }

    records.forEach(r => {
      const dateObj = new Date(r.collectionDate || r.createdAt);
      const key = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      if (trendMap[key] !== undefined) {
        trendMap[key] += r.quantity;
      }
    });

    const collectionTrend = Object.keys(trendMap).map(day => ({
      day,
      wasteKg: trendMap[day] || Math.floor(Math.random() * 200 + 150)
    }));

    res.status(200).json({
      success: true,
      kpis: {
        totalBins,
        activeBins,
        overflowingBins,
        requiringAttentionBins,
        todayCollectionsCount: todayCollections.length,
        completedCollections,
        pendingCollections,
        totalVehicles,
        availableVehicles,
        vehiclesCurrentlyCollecting,
        totalWasteCollectedKg,
        collectionEfficiency
      },
      charts: {
        wasteCategoryDistribution,
        statusDistribution,
        collectionPerformance,
        areaWiseWaste,
        collectionTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Waste Records List
// @route   GET /api/waste-records
exports.getWasteRecords = async (req, res, next) => {
  try {
    const { category, zone, startDate, endDate } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (zone && zone !== 'All') query.zone = zone;

    if (startDate || endDate) {
      query.collectionDate = {};
      if (startDate) query.collectionDate.$gte = new Date(startDate);
      if (endDate) query.collectionDate.$lte = new Date(endDate);
    }

    const records = await WasteRecord.find(query)
      .populate({ path: 'binId', select: 'binId name location' })
      .populate({ path: 'vehicleId', select: 'vehicleId registrationNumber' })
      .populate({ path: 'staffId', select: 'name email' })
      .sort({ collectionDate: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

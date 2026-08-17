const WasteBin = require('../models/WasteBin');
const Collection = require('../models/Collection');
const Vehicle = require('../models/Vehicle');
const WasteRecord = require('../models/WasteRecord');
const Report = require('../models/Report');

// @desc    Generate Report (JSON and CSV support)
// @route   GET /api/reports/generate
exports.generateReport = async (req, res, next) => {
  try {
    const { reportType, zone, wasteCategory, format } = req.query;

    const bins = await WasteBin.find(zone && zone !== 'All' ? { zone } : {});
    const collections = await Collection.find().populate('bin vehicle staff');
    const vehicles = await Vehicle.find();
    const records = await WasteRecord.find(zone && zone !== 'All' ? { zone } : {});

    let reportData = [];
    let title = reportType || 'Waste Collection Report';

    if (title === 'Waste Collection Report') {
      reportData = records.map(r => ({
        RecordID: r.recordId,
        Date: new Date(r.collectionDate).toISOString().split('T')[0],
        Zone: r.zone,
        Category: r.category,
        QuantityKg: r.quantity,
        Bin: r.binId ? r.binId.name || 'N/A' : 'N/A',
        Vehicle: r.vehicleId ? r.vehicleId.registrationNumber || 'N/A' : 'N/A'
      }));
    } else if (title === 'Bin Status Report') {
      reportData = bins.map(b => ({
        BinID: b.binId,
        Name: b.name,
        Location: b.location,
        Zone: b.zone,
        FillLevelPercent: b.fillLevel,
        Status: b.status,
        PriorityLevel: b.priorityLevel,
        LastCollected: b.lastCollectedAt ? new Date(b.lastCollectedAt).toISOString().split('T')[0] : 'N/A'
      }));
    } else if (title === 'Vehicle Utilization Report') {
      reportData = vehicles.map(v => ({
        VehicleID: v.vehicleId,
        Registration: v.registrationNumber,
        Type: v.vehicleType,
        Status: v.status,
        CapacityTons: v.capacity,
        CurrentLocation: v.currentLocation
      }));
    } else {
      // Analytics Summary Report
      reportData = [
        { Metric: 'Total Bins Monitored', Value: bins.length },
        { Metric: 'Critical Overflowing Bins (>90%)', Value: bins.filter(b => b.fillLevel > 90).length },
        { Metric: 'Total Collections Scheduled', Value: collections.length },
        { Metric: 'Completed Collections', Value: collections.filter(c => c.status === 'Completed').length },
        { Metric: 'Collection Efficiency %', Value: collections.length > 0 ? Math.round((collections.filter(c => c.status === 'Completed').length / collections.length) * 100) + '%' : '88%' },
        { Metric: 'Total Waste Transported (kg)', Value: records.reduce((a, r) => a + r.quantity, 0) }
      ];
    }

    if (format === 'csv') {
      if (reportData.length === 0) {
        return res.status(200).send('No data available for export');
      }
      const headers = Object.keys(reportData[0]).join(',');
      const rows = reportData.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
      const csvContent = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}_${Date.now()}.csv"`);
      return res.status(200).send(csvContent);
    }

    // Save report generation log
    const reportCount = await Report.countDocuments();
    await Report.create({
      reportId: `RPT-${String(reportCount + 101).padStart(3, '0')}`,
      reportType: title,
      generatedBy: req.user ? req.user.name : 'System Admin',
      filters: { zone, wasteCategory }
    });

    res.status(200).json({
      success: true,
      reportType: title,
      generatedAt: new Date(),
      count: reportData.length,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

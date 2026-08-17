const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const WasteBin = require('../models/WasteBin');
const Vehicle = require('../models/Vehicle');
const Collection = require('../models/Collection');
const WasteRecord = require('../models/WasteRecord');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_waste_db';

const seedDatabase = async () => {
  try {
    console.log(`[Seeding] Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);

    console.log(`[Seeding] Clearing existing data...`);
    await User.deleteMany();
    await WasteBin.deleteMany();
    await Vehicle.deleteMany();
    await Collection.deleteMany();
    await WasteRecord.deleteMany();
    await Notification.deleteMany();

    // 1. Create Users
    console.log(`[Seeding] Creating demo users...`);
    const adminUser = await User.create({
      name: 'Rajesh Sharma (Director)',
      email: 'admin@smartwaste.gov.in',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      zone: 'Central Zone'
    });

    const staffUser = await User.create({
      name: 'Suresh Kumar (Field Staff)',
      email: 'staff@smartwaste.gov.in',
      password: 'staff123',
      role: 'staff',
      phone: '+91 98765 12345',
      zone: 'South Zone'
    });

    const viewerUser = await User.create({
      name: 'Priya Verma (City Inspector)',
      email: 'viewer@smartwaste.gov.in',
      password: 'viewer123',
      role: 'viewer',
      phone: '+91 98765 99999',
      zone: 'East Zone'
    });

    // 2. Create Vehicles
    console.log(`[Seeding] Creating vehicle fleet...`);
    const vehicles = await Vehicle.create([
      {
        vehicleId: 'VEH-101',
        registrationNumber: 'KA-01-WM-1001',
        vehicleType: 'Compactor Truck',
        driver: staffUser._id,
        capacity: 8.5,
        status: 'Available',
        currentLocation: 'Koramangala Depot',
        lastServiceDate: new Date('2026-07-15'),
        nextServiceDate: new Date('2026-09-15')
      },
      {
        vehicleId: 'VEH-102',
        registrationNumber: 'KA-01-WM-2002',
        vehicleType: 'Mini Tipper',
        driver: staffUser._id,
        capacity: 3.2,
        status: 'Assigned',
        currentLocation: 'Indiranagar Zone',
        lastServiceDate: new Date('2026-06-20'),
        nextServiceDate: new Date('2026-08-20')
      },
      {
        vehicleId: 'VEH-103',
        registrationNumber: 'KA-01-WM-3003',
        vehicleType: 'Hook Loader',
        driver: staffUser._id,
        capacity: 10.0,
        status: 'Collecting',
        currentLocation: 'Whitefield Tech Park',
        lastServiceDate: new Date('2026-07-01'),
        nextServiceDate: new Date('2026-09-01')
      },
      {
        vehicleId: 'VEH-104',
        registrationNumber: 'KA-01-WM-4004',
        vehicleType: 'Electric Cart',
        driver: staffUser._id,
        capacity: 1.5,
        status: 'Available',
        currentLocation: 'MG Road Metro Hub',
        lastServiceDate: new Date('2026-07-25'),
        nextServiceDate: new Date('2026-09-25')
      },
      {
        vehicleId: 'VEH-105',
        registrationNumber: 'KA-01-WM-5005',
        vehicleType: 'Compactor Truck',
        driver: staffUser._id,
        capacity: 8.0,
        status: 'Maintenance',
        currentLocation: 'Central Garage',
        lastServiceDate: new Date('2026-08-01'),
        nextServiceDate: new Date('2026-08-25')
      }
    ]);

    // 3. Create Waste Bins (20 Bins in Indian Municipal Locations)
    console.log(`[Seeding] Creating waste bins across municipal zones...`);
    const binRawData = [
      { binId: 'BIN-101', name: 'Indiranagar 100ft Rd Bin A', location: '100 Feet Rd, Near Metro Gate 2', zone: 'East Zone', lat: 12.9784, lng: 77.6408, type: 'Smart Solar', cat: 'Plastic', cap: 300, fill: 94, vehIdx: 1 },
      { binId: 'BIN-102', name: 'Koramangala 5th Block Hub', location: 'Jyoti Nivas College Rd', zone: 'South Zone', lat: 12.9352, lng: 77.6245, type: 'Standard', cat: 'Organic', cap: 240, fill: 92, vehIdx: 0 },
      { binId: 'BIN-103', name: 'Whitefield ITPL Main Gate', location: 'ITPL Main Road, Pattandur Agrahara', zone: 'East Zone', lat: 12.9863, lng: 77.7337, type: 'Hazardous', cat: 'E-waste', cap: 200, fill: 88, vehIdx: 2 },
      { binId: 'BIN-104', name: 'MG Road Boulevard Bin 1', location: 'Near Trinity Metro Station', zone: 'Central Zone', lat: 12.9736, lng: 77.6180, type: 'Smart Solar', cat: 'Paper', cap: 300, fill: 78, vehIdx: 3 },
      { binId: 'BIN-105', name: 'HSR Layout Sector 1 Market', location: '27th Main Rd, HSR Layout', zone: 'South Zone', lat: 12.9121, lng: 77.6446, type: 'Compost', cat: 'Organic', cap: 240, fill: 82, vehIdx: 0 },
      { binId: 'BIN-106', name: 'Jayanagar 4th Block Complex', location: 'Near Shopping Complex & Bus Stand', zone: 'South Zone', lat: 12.9299, lng: 77.5824, type: 'Standard', cat: 'Mixed', cap: 240, fill: 68, vehIdx: 0 },
      { binId: 'BIN-107', name: 'Electronic City Phase 1 Gate', location: 'Hosur Main Road, Near Toll', zone: 'South Zone', lat: 12.8452, lng: 77.6602, type: 'Recycle', cat: 'Plastic', cap: 350, fill: 45, vehIdx: 0 },
      { binId: 'BIN-108', name: 'Commercial Street Entrance', location: 'Commercial Street Footpath', zone: 'Central Zone', lat: 12.9822, lng: 77.6083, type: 'Standard', cat: 'Mixed', cap: 240, fill: 72, vehIdx: 3 },
      { binId: 'BIN-109', name: 'Malleshwaram Sampige Road', location: '11th Cross Sampige Rd', zone: 'North Zone', lat: 12.9988, lng: 77.5714, type: 'Compost', cat: 'Organic', cap: 240, fill: 58, vehIdx: 1 },
      { binId: 'BIN-110', name: 'Hebbal Flyover Junction Bin', location: 'Outer Ring Road, Hebbal', zone: 'North Zone', lat: 13.0358, lng: 77.5970, type: 'Standard', cat: 'Mixed', cap: 400, fill: 35, vehIdx: 1 },
      { binId: 'BIN-111', name: 'Bandra West Linking Road', location: 'Linking Rd, Opposite National College', zone: 'West Zone', lat: 19.0600, lng: 72.8362, type: 'Smart Solar', cat: 'Plastic', cap: 300, fill: 91, vehIdx: 0 },
      { binId: 'BIN-112', name: 'Connaught Place Inner Circle', location: 'Block A, Inner Circle CP', zone: 'North Zone', lat: 28.6315, lng: 77.2167, type: 'Smart Solar', cat: 'Glass', cap: 300, fill: 84, vehIdx: 2 },
      { binId: 'BIN-113', name: 'Anna Nagar 2nd Avenue', location: 'Near Roundtana, Anna Nagar', zone: 'South Zone', lat: 13.0850, lng: 80.2101, type: 'Standard', cat: 'Metal', cap: 240, fill: 62, vehIdx: 0 },
      { binId: 'BIN-114', name: 'Gachibowli DLF Cybercity', location: 'Gachibowli Main Rd, Hitech City', zone: 'East Zone', lat: 17.4447, lng: 78.3483, type: 'Hazardous', cat: 'E-waste', cap: 250, fill: 95, vehIdx: 2 },
      { binId: 'BIN-115', name: 'Park Street Kolkata Central', location: 'Park Street Metro Exit 3', zone: 'East Zone', lat: 22.5551, lng: 88.3518, type: 'Recycle', cat: 'Paper', cap: 240, fill: 50, vehIdx: 3 },
      { binId: 'BIN-116', name: 'FC Road Pune Deccan Gymkhana', location: 'Fergusson College Rd', zone: 'West Zone', lat: 18.5186, lng: 73.8417, type: 'Standard', cat: 'Organic', cap: 240, fill: 28, vehIdx: 1 },
      { binId: 'BIN-117', name: 'Marathahalli Bridge Stop', location: 'ORR Marathahalli Junction', zone: 'East Zone', lat: 12.9569, lng: 77.7011, type: 'Standard', cat: 'Mixed', cap: 300, fill: 79, vehIdx: 2 },
      { binId: 'BIN-118', name: 'Banashankari Bus Terminal', location: 'BSK 2nd Stage Bus Depot', zone: 'South Zone', lat: 12.9254, lng: 77.5738, type: 'Standard', cat: 'Organic', cap: 240, fill: 18, vehIdx: 0 },
      { binId: 'BIN-119', name: 'Rajajinagar 1st Block Metro', location: 'Rajajinagar Metro Station Gate A', zone: 'North Zone', lat: 12.9902, lng: 77.5532, type: 'Recycle', cat: 'Plastic', cap: 240, fill: 32, vehIdx: 1 },
      { binId: 'BIN-120', name: 'Ulsoor Lake Promenade Bin', location: 'Ulsoor Lake Walkway', zone: 'Central Zone', lat: 12.9818, lng: 77.6189, type: 'Compost', cat: 'Organic', cap: 200, fill: 15, vehIdx: 3 }
    ];

    const createdBins = [];
    for (const b of binRawData) {
      const binDoc = new WasteBin({
        binId: b.binId,
        name: b.name,
        location: b.location,
        zone: b.zone,
        latitude: b.lat,
        longitude: b.lng,
        binType: b.type,
        wasteCategory: b.cat,
        capacity: b.cap,
        fillLevel: b.fill,
        assignedVehicle: vehicles[b.vehIdx]._id,
        lastCollectedAt: new Date(Date.now() - Math.floor(Math.random() * 48 + 4) * 3600 * 1000)
      });
      binDoc.calculateStatusAndPriority();
      await binDoc.save();
      createdBins.push(binDoc);
    }

    // 4. Create Collections
    console.log(`[Seeding] Creating collection logs...`);
    const collections = await Collection.create([
      {
        collectionId: 'COL-101',
        bin: createdBins[0]._id,
        vehicle: vehicles[1]._id,
        staff: staffUser._id,
        scheduledDate: new Date(),
        scheduledTime: '08:30 AM',
        status: 'In Progress',
        remarks: 'Priority overflow collection in progress'
      },
      {
        collectionId: 'COL-102',
        bin: createdBins[1]._id,
        vehicle: vehicles[0]._id,
        staff: staffUser._id,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'Assigned',
        remarks: 'Assigned to morning route'
      },
      {
        collectionId: 'COL-103',
        bin: createdBins[2]._id,
        vehicle: vehicles[2]._id,
        staff: staffUser._id,
        scheduledDate: new Date(),
        scheduledTime: '10:15 AM',
        status: 'Scheduled',
        remarks: 'E-waste special handling required'
      },
      {
        collectionId: 'COL-104',
        bin: createdBins[3]._id,
        vehicle: vehicles[3]._id,
        staff: staffUser._id,
        scheduledDate: new Date(Date.now() - 24 * 3600 * 1000),
        scheduledTime: '04:00 PM',
        actualCollectionTime: new Date(Date.now() - 22 * 3600 * 1000),
        quantityCollected: 210,
        status: 'Completed',
        remarks: 'Collected successfully'
      },
      {
        collectionId: 'COL-105',
        bin: createdBins[4]._id,
        vehicle: vehicles[0]._id,
        staff: staffUser._id,
        scheduledDate: new Date(Date.now() - 48 * 3600 * 1000),
        scheduledTime: '11:00 AM',
        actualCollectionTime: new Date(Date.now() - 46 * 3600 * 1000),
        quantityCollected: 180,
        status: 'Completed',
        remarks: 'Cleared organic waste'
      },
      {
        collectionId: 'COL-106',
        bin: createdBins[13]._id,
        vehicle: vehicles[2]._id,
        staff: staffUser._id,
        scheduledDate: new Date(),
        scheduledTime: '02:00 PM',
        status: 'Delayed',
        remarks: 'Traffic congestion delayed arrival'
      }
    ]);

    // 5. Create Waste Records
    console.log(`[Seeding] Creating historical waste records...`);
    const categories = ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass', 'E-waste', 'Mixed'];
    const zones = ['Central Zone', 'East Zone', 'South Zone', 'North Zone', 'West Zone'];

    for (let i = 1; i <= 15; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const cat = categories[i % categories.length];
      const zn = zones[i % zones.length];
      const qty = Math.floor(Math.random() * 250 + 80);

      await WasteRecord.create({
        recordId: `WR-${1000 + i}`,
        collectionId: collections[i % collections.length]._id,
        binId: createdBins[i % createdBins.length]._id,
        category: cat,
        quantity: qty,
        unit: 'kg',
        zone: zn,
        collectionDate: new Date(Date.now() - daysAgo * 24 * 3600 * 1000),
        vehicleId: vehicles[i % vehicles.length]._id,
        staffId: staffUser._id
      });
    }

    // 6. Create Notifications
    console.log(`[Seeding] Creating initial notifications...`);
    await Notification.create([
      {
        title: 'CRITICAL: Bin BIN-101 Overflowing!',
        message: 'Indiranagar 100ft Rd Bin A is 94% full. Immediate collection required!',
        severity: 'critical',
        type: 'overflow',
        relatedEntity: 'BIN-101'
      },
      {
        title: 'CRITICAL: Bin BIN-114 E-Waste Full',
        message: 'Gachibowli DLF Cybercity bin has reached 95% capacity.',
        severity: 'critical',
        type: 'overflow',
        relatedEntity: 'BIN-114'
      },
      {
        title: 'Warning: Bin BIN-102 Crossed 90%',
        message: 'Koramangala 5th Block Hub bin is 92% full.',
        severity: 'high',
        type: 'overflow',
        relatedEntity: 'BIN-102'
      },
      {
        title: 'Collection COL-106 Delayed',
        message: 'Collection COL-106 at Gachibowli is delayed due to traffic.',
        severity: 'warning',
        type: 'delay',
        relatedEntity: 'COL-106'
      },
      {
        title: 'Vehicle VEH-105 Sent to Maintenance',
        message: 'Compactor Truck KA-01-WM-5005 placed in maintenance schedule.',
        severity: 'info',
        type: 'maintenance',
        relatedEntity: 'VEH-105'
      }
    ]);

    console.log(`[Seeding] Success! Database populated cleanly.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeding Error]`, error);
    process.exit(1);
  }
};

seedDatabase();

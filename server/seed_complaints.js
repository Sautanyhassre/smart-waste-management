const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Complaint = require('./models/Complaint');

const sampleComplaints = [
  {
    complaintId: 'CMP-2001',
    userName: 'Dhivya Dharshini S',
    userEmail: 'dhivya.dharshini.s@smartwaste.gov.in',
    userPhone: '+91 98401 11221',
    issueType: 'Overflowing Bin',
    priority: 'Critical',
    zone: 'East Zone',
    location: '100 Feet Road, Near Metro Station, Indiranagar',
    binId: 'BIN-101',
    description: 'Smart bin sensor reporting >95% capacity. Waste spilling onto the pedestrian pathway and attracting stray animals.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    complaintId: 'CMP-2002',
    userName: 'Divyadharshini K',
    userEmail: 'divyadharshini.k@smartwaste.gov.in',
    userPhone: '+91 98402 22332',
    issueType: 'Missed Waste Collection',
    priority: 'High',
    zone: 'South Zone',
    location: '5th Block Commercial Market Road, Koramangala',
    binId: 'BIN-102',
    description: 'Scheduled morning 8:30 AM wet-waste compactor truck did not arrive. Market vegetable bins are full.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    complaintId: 'CMP-2003',
    userName: 'Kavisurya B',
    userEmail: 'kavisurya.b@smartwaste.gov.in',
    userPhone: '+91 98403 33443',
    issueType: 'Damaged / Broken Bin',
    priority: 'Medium',
    zone: 'East Zone',
    location: 'ITPL Main Gate, Whitefield Tech Zone',
    binId: 'BIN-103',
    description: 'Pedal lid mechanism jammed and upper solar sensor cover cracked. Automatic fill telemetry unstable.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 9)
  },
  {
    complaintId: 'CMP-2004',
    userName: 'Rithu Pavisha S',
    userEmail: 'rithu.pavisha.s@smartwaste.gov.in',
    userPhone: '+91 98404 44554',
    issueType: 'Foul Odor / Hazardous Waste',
    priority: 'Critical',
    zone: 'South Zone',
    location: '27th Main Road, Sector 2, HSR Layout',
    binId: 'BIN-104',
    description: 'Severe foul odor and liquid runoff from unsegregated organic waste bin near residential apartments.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    complaintId: 'CMP-2005',
    userName: 'Sautanyhassre B T',
    userEmail: 'sautanyhassre.bt@smartwaste.gov.in',
    userPhone: '+91 98405 55665',
    issueType: 'Overflowing Bin',
    priority: 'High',
    zone: 'Central Zone',
    location: 'Church Street Junction, MG Road Metro Station',
    binId: 'BIN-105',
    description: 'Recyclables plastic bottle bin completely full after weekend evening foot traffic. Needs immediate clearance.',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3600000 * 1)
  },
  {
    complaintId: 'CMP-2006',
    userName: 'Shreya B',
    userEmail: 'shreya.b@smartwaste.gov.in',
    userPhone: '+91 98406 66776',
    issueType: 'Illegal Dumping',
    priority: 'High',
    zone: 'North Zone',
    location: 'Near Hebbal Flyover Service Road',
    binId: 'BIN-106',
    description: 'Construction packaging debris and mixed waste dumped on open curb near municipal park perimeter.',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3600000 * 18)
  },
  {
    complaintId: 'CMP-2007',
    userName: 'Varsha C',
    userEmail: 'varsha.c@smartwaste.gov.in',
    userPhone: '+91 98407 77887',
    issueType: 'Vehicle Spillage',
    priority: 'Medium',
    zone: 'West Zone',
    location: 'Rajajinagar 1st Block Main Road',
    binId: 'BIN-107',
    description: 'Waste spillage observed along 50 meters of roadway from collection vehicle transit.',
    status: 'Resolved',
    resolutionNotes: 'Street sweeping squad dispatched and roadway cleared completely at 07:15 AM.',
    createdAt: new Date(Date.now() - 86400000 * 1.5),
    resolvedAt: new Date(Date.now() - 86400000 * 1)
  },
  {
    complaintId: 'CMP-2008',
    userName: 'PS',
    userEmail: 'ps.officer@smartwaste.gov.in',
    userPhone: '+91 98408 88998',
    issueType: 'Overflowing Bin',
    priority: 'Critical',
    zone: 'Central Zone',
    location: 'Brigade Road Commercial Hub Cross',
    binId: 'BIN-108',
    description: 'Commercial wet waste bin overflowing outside shopping plaza. Immediate pickup dispatch requested.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 4)
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    for (const item of sampleComplaints) {
      await Complaint.findOneAndUpdate(
        { complaintId: item.complaintId },
        item,
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded complaint: ${item.complaintId} by ${item.userName}`);
    }

    console.log('\nAll 8 complaints seeded successfully into MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

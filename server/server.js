const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Body Parser & CORS Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true
}));

// Connect to MongoDB
connectDB();

// API Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bins', require('./routes/binRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart Waste Management API Service active',
    timestamp: new Date()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Smart Waste Management REST Server Running on Port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

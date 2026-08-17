# Smart Waste Management Monitoring and Analytics Dashboard

An academic final-year CSE project for centralized municipal waste collection monitoring, IoT bin fill tracking, vehicle fleet management, dynamic priority dispatching, interactive GIS mapping, and comprehensive operational analytics.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Supports **Admin**, **Waste Collection Staff**, and **Viewer / Municipality Officer** roles.
- **Smart Collection Priority Engine**: Dynamic backend priority score calculation based on fill level %, time elapsed since last collection, and criticality thresholds.
- **Real-Time Interactive GIS Map**: Leaflet integration showing municipal waste bins across Indian cities with color-coded markers (Green, Yellow, Orange, Red) and live status popups.
- **Waste Bin & Fleet Management**: Full CRUD operations for waste bins and collection vehicles with active maintenance state validation.
- **Collection Workflow Tracking**: Schedule collections, assign vehicles and staff, track status (`Scheduled` → `Assigned` → `In Progress` → `Completed`), and log waste weight (kg).
- **Dynamic Notifications & Alerts**: Auto-generated in-app notifications when bins cross 75% or 90% capacity or when collections are delayed.
- **Operational Analytics & Visual Charts**: Recharts visualizations for waste generation trends, bin status distribution, category breakdown, area comparisons, and efficiency %.
- **Custom Reports & Export**: Customizable filters (Date Range, Zone, Category) with one-click **CSV export** and **PDF print preview**.
- **Automated Database Seeder**: Includes `npm run seed` populating 20+ waste bins, 5 vehicles, collections, waste records, and demo accounts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Leaflet / React-Leaflet, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js, Express.js, REST API architecture, JWT authentication, bcryptjs password hashing.
- **Database**: MongoDB & Mongoose ODM.

---

## 🚀 Quick Setup & Demonstration Guide

### 1. Install Server Dependencies & Seed Database
```bash
cd server
npm install
npm run seed
```

### 2. Start Backend Server
```bash
npm run dev
# Server will run at http://localhost:5000
```

### 3. Install Client Dependencies & Launch Frontend
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Client will launch at http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smartwaste.gov.in` | `admin123` | Full administrative control, CRUD for Bins & Vehicles, Task Scheduling, Reports & Settings |
| **Staff** | `staff@smartwaste.gov.in` | `staff123` | View assigned collections, update task status, record collected waste (kg), log remarks |
| **Viewer** | `viewer@smartwaste.gov.in` | `viewer123` | Executive read-only access for KPIs, GIS map, analytics charts, and report exports |

*Note: You can also use the **1-Click Demo Buttons** directly on the Login screen!*

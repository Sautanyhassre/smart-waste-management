# Production Deployment Guide — Smart Waste Management Dashboard

This guide explains how to deploy the full-stack **Smart Waste Management Monitoring and Analytics Dashboard** online for free using **MongoDB Atlas**, **Render (Backend)**, and **Vercel / Render (Frontend)**.

---

## 🗄️ Step 1: Deploy MongoDB Database (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Build a Database** and select the **M0 Free Cluster**.
3. Under **Database Access**, create a user with a username and password (e.g. `smartwasteuser` / `securepassword123`).
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** → **Drivers** and copy your MongoDB connection string URI:
   ```text
   mongodb+srv://smartwasteuser:securepassword123@cluster0.xxx.mongodb.net/smart_waste_db?retryWrites=true&w=majority
   ```
6. **Seed your cloud database**:
   In your local `server/.env` file, update `MONGO_URI` to your Atlas URI and run:
   ```bash
   cd server
   npm run seed
   ```

---

## 🚀 Step 2: Deploy Backend REST API (Render.com)

1. Create a free account at [Render.com](https://render.com).
2. Connect your GitHub repository containing the project.
3. Click **New +** → **Web Service**.
4. Configure the Web Service:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables**:
   - `MONGO_URI` = `mongodb+srv://smartwasteuser:securepassword123@cluster0.xxx.mongodb.net/smart_waste_db?retryWrites=true&w=majority`
   - `JWT_SECRET` = `production_super_secret_jwt_key_2026`
   - `PORT` = `5000`
   - `CLIENT_URL` = `https://your-frontend-url.vercel.app`
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g. `https://smart-waste-backend.onrender.com`).

---

## 💻 Step 3: Deploy Frontend Application (Vercel)

1. Create a free account at [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** and import your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Update `client/src/services/api.js` to point `API_BASE_URL` to your live Render backend URL:
   ```js
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-waste-backend.onrender.com/api';
   ```
5. Add **Environment Variable** in Vercel settings:
   - `VITE_API_BASE_URL` = `https://smart-waste-backend.onrender.com/api`
6. Click **Deploy**. Vercel will build your application and generate a public live production link (e.g., `https://smart-waste-dashboard.vercel.app`).

---

## 🌐 Production Architecture Checklist

```
 [Users worldwide] ────> [Vercel Frontend] (https://smart-waste.vercel.app)
                              │
                              │ HTTPS REST API
                              ▼
                       [Render Backend] (https://smart-waste-api.onrender.com)
                              │
                              │ Mongoose ODM
                              ▼
                       [MongoDB Atlas] (Cloud Cluster)
```

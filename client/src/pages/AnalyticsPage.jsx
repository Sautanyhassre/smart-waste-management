import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { BarChart3, TrendingUp, Calendar, Zap, Award, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('Weekly');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/overview');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Backend offline, using analytics mock');
      setData({
        kpis: {
          totalWasteCollectedKg: 4520,
          collectionEfficiency: 89,
          overflowRate: 4.2,
          vehicleUtilization: 82,
          binUtilization: 76
        },
        charts: {
          collectionTrend: [
            { day: 'Mon', wasteKg: 420 },
            { day: 'Tue', wasteKg: 510 },
            { day: 'Wed', wasteKg: 480 },
            { day: 'Thu', wasteKg: 620 },
            { day: 'Fri', wasteKg: 590 },
            { day: 'Sat', wasteKg: 710 },
            { day: 'Sun', wasteKg: 840 }
          ],
          wasteCategoryDistribution: [
            { category: 'Organic', quantity: 1500 },
            { category: 'Plastic', quantity: 980 },
            { category: 'Paper', quantity: 640 },
            { category: 'Glass', quantity: 410 },
            { category: 'E-waste', quantity: 350 },
            { category: 'Metal', quantity: 290 }
          ],
          areaWiseWaste: [
            { zone: 'East Zone', quantity: 1650 },
            { zone: 'South Zone', quantity: 1320 },
            { zone: 'Central Zone', quantity: 1100 },
            { zone: 'North Zone', quantity: 940 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <Loader text="Computing high-level analytics & efficiency metrics..." />;

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" /> Operational Analytics & Efficiency Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Deep operational metrics, vehicle fleet utilization, and municipal waste generation analytics.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          {['Daily', 'Weekly', 'Monthly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Waste Collected" value={`${kpis.totalWasteCollectedKg || 4520}`} unit="kg" icon={TrendingUp} color="emerald" />
        <StatCard title="Collection Efficiency" value={`${kpis.collectionEfficiency || 89}%`} icon={Award} color="cyan" trend="up" trendValue="3.5%" />
        <StatCard title="Overflow Rate" value={`${kpis.overflowRate || 4.2}%`} icon={Zap} color="amber" />
        <StatCard title="Vehicle Utilization" value={`${kpis.vehicleUtilization || 82}%`} icon={BarChart3} color="indigo" />
        <StatCard title="Bin Utilization" value={`${kpis.binUtilization || 76}%`} icon={BarChart2} color="emerald" />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Tonnage Line Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Waste Collection Tonnage ({timeRange})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.collectionTrend || []}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="wasteKg" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Comparison Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> Municipal Zone Volume Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.areaWiseWaste || []}>
                <XAxis dataKey="zone" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="quantity" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

import React, { useState, useEffect } from 'react';
import { 
  Users, Store, Package, ShoppingBag, DollarSign, 
  TrendingUp, ArrowUpRight, Clock, CheckCircle
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Mon', ads: 40, users: 24, revenue: 2400 },
  { name: 'Tue', ads: 30, users: 13, revenue: 2210 },
  { name: 'Wed', ads: 20, users: 98, revenue: 2290 },
  { name: 'Thu', ads: 27, users: 39, revenue: 2000 },
  { name: 'Fri', ads: 18, users: 48, revenue: 2181 },
  { name: 'Sat', ads: 23, users: 38, revenue: 2500 },
  { name: 'Sun', ads: 34, users: 43, revenue: 2100 },
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    totalRevenue: 0,
    todayVisitors: 1240, // Mocked
    monthlyEarnings: 15400 // Mocked
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      const docs = snap.docs.map(d => d.data());
      setStats(prev => ({ 
        ...prev, 
        totalAds: snap.size,
        activeAds: docs.filter(d => d.status === 'approved').length,
        pendingAds: docs.filter(d => d.status === 'pending').length
      }));
    });

    return () => {
      unsubUsers();
      unsubProducts();
    };
  }, []);

  const widgets = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', trend: '+12%' },
    { label: 'Total Sellers', value: stats.totalSellers || 12, icon: Store, color: 'purple', trend: '+5%' },
    { label: 'Total Ads', value: stats.totalAds, icon: Package, color: 'emerald', trend: '+18%' },
    { label: 'Active Ads', value: stats.activeAds, icon: CheckCircle, color: 'green', trend: '+22%' },
    { label: 'Pending Ads', value: stats.pendingAds, icon: Clock, color: 'amber', trend: '-4%' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue || '4,250'}`, icon: DollarSign, color: 'amber', trend: '+15%' },
    { label: "Today's Visitors", value: stats.todayVisitors, icon: TrendingUp, color: 'indigo', trend: '+8%' },
    { label: 'Monthly Earnings', value: `$${stats.monthlyEarnings}`, icon: DollarSign, color: 'rose', trend: '+10%' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((w, i) => (
          <motion.div 
            key={w.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${w.color}-50 text-${w.color}-600`}>
                <w.icon className="h-6 w-6" />
              </div>
              <span className={`text-xs font-bold ${w.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                {w.trend} <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{w.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{w.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ads Posting & User Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="ads" stroke="#10b981" fillOpacity={1} fill="url(#colorAds)" strokeWidth={3} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

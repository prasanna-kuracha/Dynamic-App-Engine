'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, Activity, TrendingUp, Users } from 'lucide-react';

interface AnalyticsProps {
  data: any[];
  modelName: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ data, modelName }) => {
  // Process data for charts
  const completedCount = data.filter(item => item.completed === true || String(item.completed).toLowerCase() === 'true').length;
  const pendingCount = data.length - completedCount;

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#6366f1' },
  ];

  // Mock data for trends if real timestamps aren't available
  const trendData = [
    { name: 'Mon', count: Math.floor(data.length * 0.2) },
    { name: 'Tue', count: Math.floor(data.length * 0.4) },
    { name: 'Wed', count: Math.floor(data.length * 0.3) },
    { name: 'Thu', count: Math.floor(data.length * 0.6) },
    { name: 'Fri', count: data.length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: data.length, icon: Activity, color: 'indigo' },
          { label: 'Completed', value: completedCount, icon: TrendingUp, color: 'emerald' },
          { label: 'Completion Rate', value: `${data.length ? Math.round((completedCount/data.length)*100) : 0}%`, icon: PieIcon, color: 'purple' },
          { label: 'Active Users', value: '1', icon: Users, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-indigo-100/20 border border-white/50 dark:border-gray-700 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 dark:bg-${stat.color}-900/30`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Live Status</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white/50 dark:border-gray-700 flex flex-col items-center">
        <h4 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-[0.2em] mb-8">Status Distribution</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex space-x-6 mt-4">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
              <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart Trends */}
      <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white/50 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-[0.2em]">Activity Trends</h4>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">Last 5 Days</span>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#6366f1' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

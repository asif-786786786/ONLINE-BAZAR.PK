import React from 'react';
import { BarChart3, Download, Calendar, Filter, FileText } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const reports = [
    { title: 'Daily Ads Report', description: 'Summary of ads posted in the last 24 hours', date: 'Today' },
    { title: 'User Registration Report', description: 'New user growth and verification status', date: 'This Week' },
    { title: 'Sales Report', description: 'Detailed breakdown of all completed transactions', date: 'This Month' },
    { title: 'Earnings Report', description: 'Platform commission and premium ad revenue', date: 'This Month' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            <span>Select Range</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <FileText className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{report.date}</span>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{report.description}</p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button className="text-sm font-bold text-emerald-600 hover:underline">View Online</button>
              <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

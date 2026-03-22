import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminUsers } from './admin/AdminUsers';
import { AdminSellers } from './admin/AdminSellers';
import { AdminAds } from './admin/AdminAds';
import { AdminCategories } from './admin/AdminCategories';
import { AdminPayments } from './admin/AdminPayments';
import { AdminSettings } from './admin/AdminSettings';
import { AdminOrders } from './admin/AdminOrders';
import { AdminReports } from './admin/AdminReports';
import { AdminMessages } from './admin/AdminMessages';
import { AdminReviews } from './admin/AdminReviews';
import { AdminManagement } from './admin/AdminManagement';
import { AdminSecurity } from './admin/AdminSecurity';
import { Search, Bell, MessageSquare, User, LogOut } from 'lucide-react';
import { logout } from '../firebase';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <AdminUsers />;
      case 'sellers': return <AdminSellers />;
      case 'ads': return <AdminAds />;
      case 'categories': return <AdminCategories />;
      case 'orders': return <AdminOrders />;
      case 'payments': return <AdminPayments />;
      case 'reports': return <AdminReports />;
      case 'messages': return <AdminMessages />;
      case 'reviews': return <AdminReviews />;
      case 'admins': return <AdminManagement />;
      case 'settings': return <AdminSettings />;
      case 'security': return <AdminSecurity />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 px-4 lg:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-emerald-600 tracking-tight hidden lg:block">ONLINE BAZAR.PK Admin</span>
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl">
            <MessageSquare className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">Super Admin</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Online</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm overflow-hidden">
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  LayoutDashboard, Users, Store, Package, Layers, ShoppingCart, 
  CreditCard, BarChart3, MessageSquare, Star, ShieldCheck, 
  Settings, Lock, LogOut 
} from 'lucide-react';

export type AdminTab = 
  | 'dashboard' | 'users' | 'sellers' | 'ads' | 'categories' 
  | 'orders' | 'payments' | 'reports' | 'messages' | 'reviews' 
  | 'admins' | 'settings' | 'security';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'sellers', label: 'Seller Management', icon: Store },
    { id: 'ads', label: 'Ads / Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'admins', label: 'Admin Management', icon: ShieldCheck },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'security', label: 'Security Settings', icon: Lock },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as AdminTab)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

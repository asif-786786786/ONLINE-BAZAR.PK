import React from 'react';
import { Globe, Mail, MessageSquare, Search, Image as ImageIcon, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Website Settings</h2>
        <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg">
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 text-emerald-600 mb-2">
            <Globe className="h-6 w-6" />
            <h3 className="text-lg font-bold text-gray-900">General Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Website Name</label>
              <input type="text" defaultValue="ONLINE BAZAR.PK" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Support Email</label>
              <input type="email" defaultValue="support@onlinebazar.pk" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Website Logo</label>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <ImageIcon className="h-8 w-8" />
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                Change Logo
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 text-blue-600 mb-2">
            <Search className="h-6 w-6" />
            <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Meta Title</label>
            <input type="text" defaultValue="ONLINE BAZAR.PK - Buy & Sell Locally" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Meta Description</label>
            <textarea rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all">The best place to trade pre-loved items in your community.</textarea>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 text-amber-600 mb-2">
            <Mail className="h-6 w-6" />
            <h3 className="text-lg font-bold text-gray-900">API & Integrations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">SMS API Key</label>
              <input type="password" value="••••••••••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Stripe Secret Key</label>
              <input type="password" value="••••••••••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

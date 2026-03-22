import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Smartphone, Car, Home, Laptop, Briefcase, Shirt } from 'lucide-react';

const initialCategories = [
  { id: '1', name: 'Mobiles', icon: Smartphone, count: 1240 },
  { id: '2', name: 'Vehicles', icon: Car, count: 850 },
  { id: '3', name: 'Property', icon: Home, count: 420 },
  { id: '4', name: 'Electronics', icon: Laptop, count: 2100 },
  { id: '5', name: 'Jobs', icon: Briefcase, count: 320 },
  { id: '6', name: 'Fashion', icon: Shirt, count: 1500 },
];

export const AdminCategories: React.FC = () => {
  const [categories] = useState(initialCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
        <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg">
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <cat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count} Ads</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Smartphone, Car, Home, Laptop, Briefcase, Shirt, Dog, Sofa, 
  MoreHorizontal, CheckCircle2, Clock, AlertCircle, Trash2, Edit 
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone, color: 'bg-blue-50 text-blue-600' },
  { id: 'vehicles', name: 'Vehicles', icon: Car, color: 'bg-red-50 text-red-600' },
  { id: 'property', name: 'Property', icon: Home, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'electronics', name: 'Electronics', icon: Laptop, color: 'bg-purple-50 text-purple-600' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, color: 'bg-amber-50 text-amber-600' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'bg-pink-50 text-pink-600' },
  { id: 'animals', name: 'Animals', icon: Dog, color: 'bg-orange-50 text-orange-600' },
  { id: 'furniture', name: 'Furniture', icon: Sofa, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'others', name: 'Others', icon: MoreHorizontal, color: 'bg-gray-50 text-gray-600' },
];

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto py-4 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null 
            ? 'bg-emerald-600 text-white shadow-md' 
            : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

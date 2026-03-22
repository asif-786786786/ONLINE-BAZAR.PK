import React from 'react';
import { Star, User, MessageSquare, Trash2, ShieldCheck, Flag } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start space-x-6 group hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Alex Johnson</h4>
                  <div className="flex items-center space-x-1 text-amber-500 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= 4 ? 'fill-current' : ''}`} />
                    ))}
                    <span className="text-xs font-bold text-gray-400 ml-2">4.0 Rating</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                "Great seller! The item was exactly as described and the delivery was very fast. Highly recommended for anyone looking for quality electronics."
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <span className="px-2 py-1 bg-gray-50 rounded-lg">Product ID: #8234{i}</span>
                  <span className="px-2 py-1 bg-gray-50 rounded-lg">Seller: TechStore</span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

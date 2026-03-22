import React from 'react';
import { MessageSquare, User, Search, Send, MoreVertical } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors ${i === 1 ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
              <div className="h-12 w-12 bg-gray-200 rounded-2xl overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900 truncate">User {i}</p>
                  <span className="text-[10px] text-gray-400">12:45 PM</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">Is the item still available for sale?</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-xl overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=1" alt="" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">User 1</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-md">
              <p className="text-sm text-gray-700">Hello, I'm interested in the iPhone 13 Pro. Is it still available?</p>
              <span className="text-[10px] text-gray-400 mt-2 block">12:40 PM</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-emerald-600 p-4 rounded-2xl rounded-tr-none shadow-md max-w-md text-white">
              <p className="text-sm">Yes, it is! I just posted it this morning.</p>
              <span className="text-[10px] text-emerald-200 mt-2 block">12:42 PM</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:bg-emerald-700 transition-all">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

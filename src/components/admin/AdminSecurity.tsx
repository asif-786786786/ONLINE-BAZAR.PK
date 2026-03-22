import React from 'react';
import { Shield, Key, Eye, Smartphone, Lock, AlertTriangle } from 'lucide-react';

export const AdminSecurity: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Smartphone className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md">
            Enable
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Key className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500 mt-1">Regularly update your password to stay secure.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            Update
          </button>
        </div>

        <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-white text-red-600 rounded-2xl shadow-sm">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Login Session Management</h3>
              <p className="text-sm text-red-600/70 mt-1">Log out from all other devices and active sessions.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-md">
            Logout All
          </button>
        </div>
      </div>
    </div>
  );
};

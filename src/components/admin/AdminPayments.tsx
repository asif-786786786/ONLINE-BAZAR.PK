import React from 'react';
import { CreditCard, Wallet, History, Settings as SettingsIcon, DollarSign, ArrowUpRight } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payments System</h2>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
            <ArrowUpRight className="h-5 w-5 rotate-180" />
            <span>Deposit</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg">
            <ArrowUpRight className="h-5 w-5" />
            <span>Withdraw</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            Commission Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="h-24 w-24" />
          </div>
          <p className="text-emerald-100 text-sm font-medium">Total Platform Earnings</p>
          <p className="text-4xl font-black mt-2">$24,580.00</p>
          <div className="mt-6 flex items-center text-emerald-200 text-xs font-bold">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Premium Ad Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$8,240.00</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <History className="h-6 w-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending Payouts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$1,150.00</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          <button className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">TXN-98234{i}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">John Doe</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Stripe</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">$49.00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

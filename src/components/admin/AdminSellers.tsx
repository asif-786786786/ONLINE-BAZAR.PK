import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserProfile, OperationType } from '../../types';
import { handleFirestoreError } from '../../utils';
import { Search, ShieldCheck, XCircle, Star, Package, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminSellers: React.FC = () => {
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, we might have a specific flag for sellers
    const q = query(collection(db, 'users'), where('role', 'in', ['user', 'admin'])); 
    const unsub = onSnapshot(q, (snap) => {
      setSellers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
    });
    return unsub;
  }, []);

  const handleVerify = async (userId: string, isVerified: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified: !isVerified });
      toast.success(`Seller ${!isVerified ? 'verified' : 'unverified'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Seller ID</th>
                <th className="px-6 py-4 font-semibold">Shop Name</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.map((seller) => (
                <tr key={seller.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{seller.uid.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{seller.displayName}'s Store</span>
                      {seller.isVerified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.displayName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      seller.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {seller.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button 
                      onClick={() => handleVerify(seller.uid, !!seller.isVerified)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title={seller.isVerified ? 'Remove Verification' : 'Verify Seller'}
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                      <Package className="h-5 w-5" />
                    </button>
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

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product, OperationType } from '../../types';
import { handleFirestoreError } from '../../utils';
import { Search, CheckCircle2, XCircle, Trash2, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAds(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
    return unsub;
  }, []);

  const handleStatus = async (id: string, status: Product['status']) => {
    try {
      await updateDoc(doc(db, 'products', id), { status });
      toast.success(`Ad ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handlePromote = async (id: string, isFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { isFeatured: !isFeatured });
      toast.success(`Ad ${!isFeatured ? 'promoted' : 'unpromoted'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Ads / Products Management</h2>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search ads..."
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
                <th className="px-6 py-4 font-semibold">Ad ID</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Seller</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{ad.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={ad.images[0]} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-bold text-gray-900 truncate max-w-[150px]">{ad.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{ad.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ad.sellerName}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${ad.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      ad.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button 
                      onClick={() => handlePromote(ad.id, !!ad.isFeatured)}
                      className={`p-2 rounded-xl transition-colors ${ad.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:bg-gray-50'}`}
                    >
                      <TrendingUp className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleStatus(ad.id, 'approved')}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleStatus(ad.id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <XCircle className="h-5 w-5" />
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

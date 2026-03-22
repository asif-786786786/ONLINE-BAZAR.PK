import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, serverTimestamp, query, where, onSnapshot, 
  doc, updateDoc, deleteDoc, orderBy 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Product, OperationType, UserProfile } from '../types';
import { handleFirestoreError } from '../utils';
import { Plus, Trash2, Edit, Package, DollarSign, Tag, MapPin, Image as ImageIcon, XCircle, RefreshCw, Store } from 'lucide-react';
import { CATEGORIES } from './CategoryFilter';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

interface SellerPanelProps {
  user: UserProfile;
}

export const SellerPanel: React.FC<SellerPanelProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'others',
    location: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'products'), 
      where('sellerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location,
        images: [formData.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`],
        sellerId: auth.currentUser.uid,
        sellerName: user.displayName || 'Anonymous Seller',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'products'), productData);
      toast.success('Ad posted successfully! Waiting for admin approval.');
      setShowAddForm(false);
      setFormData({ title: '', description: '', price: '', category: 'others', location: '', imageUrl: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Ad deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleBecomeSeller = async () => {
    if (!auth.currentUser) return;
    setIsUpgrading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        role: 'seller'
      });
      toast.success('Congratulations! You are now a seller.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (user.role === 'user') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 space-y-6">
          <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
            <Store className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900">Start Your Selling Journey</h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Join our community of sellers and reach thousands of potential buyers every day.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-600">0% Fees</div>
              <p className="text-xs text-gray-500">Keep all your earnings from every sale.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-600">Fast Ads</div>
              <p className="text-xs text-gray-500">Post your items in less than a minute.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-600">Secure</div>
              <p className="text-xs text-gray-500">Verified buyers and safe messaging.</p>
            </div>
          </div>

          <button 
            onClick={handleBecomeSeller}
            disabled={isUpgrading}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
          >
            {isUpgrading ? (
              <>
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span>Opening Account...</span>
              </>
            ) : (
              <>
                <Store className="h-6 w-6" />
                <span>Open Seller Account Now</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-400">By clicking, you agree to our Seller Terms & Conditions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your listings and sales</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Ad</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Create New Listing</h2>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Tag className="h-4 w-4" /> <span>Title</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      placeholder="What are you selling?"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" /> <span>Price ($)</span>
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Package className="h-4 w-4" /> <span>Category</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" /> <span>Location</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" /> <span>Image URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    placeholder="Describe your product in detail..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-100"
                >
                  Publish Listing
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
            <div className="relative aspect-video">
              <img 
                src={product.images[0]} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                product.status === 'approved' ? 'bg-emerald-500 text-white' :
                product.status === 'pending' ? 'bg-amber-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {product.status}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 truncate flex-1">{product.title}</h3>
                <span className="font-bold text-emerald-600 ml-2">${product.price}</span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

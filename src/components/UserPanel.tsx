import React, { useState, useEffect } from 'react';
import { 
  collection, query, where, onSnapshot, orderBy, doc, updateDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Chat, Product, OperationType, UserProfile, Order } from '../types';
import { handleFirestoreError } from '../utils';
import { 
  MessageSquare, Heart, Settings, User as UserIcon, Package, ShoppingBag, Clock,
  ShieldCheck, Users, Store, Layers, ShoppingCart, CreditCard, BarChart3, Star,
  ArrowUpRight, Wallet, RefreshCw
} from 'lucide-react';
import { AdminUsers } from './admin/AdminUsers';
import { AdminSellers } from './admin/AdminSellers';
import { AdminAds } from './admin/AdminAds';
import { AdminCategories } from './admin/AdminCategories';
import { AdminPayments } from './admin/AdminPayments';
import { AdminSettings } from './admin/AdminSettings';
import { AdminOrders } from './admin/AdminOrders';
import { AdminReports } from './admin/AdminReports';
import { AdminMessages } from './admin/AdminMessages';
import { AdminReviews } from './admin/AdminReviews';
import { AdminManagement } from './admin/AdminManagement';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface UserPanelProps {
  user: UserProfile;
  onOpenChat: (chat: Chat) => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ user, onOpenChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('chats');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$' });
  const [paymentMethod, setPaymentMethod] = useState('Visa/Mastercard');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBecomeSeller = async () => {
    if (!auth.currentUser) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        role: 'seller'
      });
      toast.success('Congratulations! You are now a seller.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    } finally {
      setIsProcessing(false);
    }
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AED', symbol: 'DH', name: 'UAE Dirham' },
    { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Visa/Mastercard', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: Store },
    { id: 'jazzcash', name: 'JazzCash', icon: Wallet },
    { id: 'easypaisa', name: 'EasyPaisa', icon: Wallet },
    { id: 'gpay', name: 'Google Pay', icon: CreditCard },
    { id: 'applepay', name: 'Apple Pay', icon: CreditCard },
  ];

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  const dbTables = [
    { id: 'admin_admins', label: 'Admins', icon: ShieldCheck },
    { id: 'admin_users', label: 'Users', icon: Users },
    { id: 'admin_sellers', label: 'Sellers', icon: Store },
    { id: 'admin_products', label: 'Products', icon: Package },
    { id: 'admin_categories', label: 'Categories', icon: Layers },
    { id: 'admin_orders', label: 'Orders', icon: ShoppingCart },
    { id: 'admin_payments', label: 'Payments', icon: CreditCard },
    { id: 'admin_messages', label: 'Messages', icon: MessageSquare },
    { id: 'admin_reviews', label: 'Reviews', icon: Star },
    { id: 'admin_reports', label: 'Reports', icon: BarChart3 },
    { id: 'admin_settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Fetch Chats
    const qChats = query(
      collection(db, 'chats'),
      where('buyerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribeChats = onSnapshot(qChats, (snapshot) => {
      const c = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(c);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
    });

    // Fetch Orders
    const qOrders = query(
      collection(db, 'orders'),
      where('buyerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const o = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(o);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubscribeChats();
      unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch User Balance
    const unsubscribeUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setWalletBalance(doc.data().balance || 0);
      }
    });

    // Fetch Transactions
    const qPayments = query(
      collection(db, 'payments'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(p);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'payments');
    });

    return () => {
      unsubscribeUser();
      unsubscribePayments();
    };
  }, []);

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    if (!auth.currentUser) return;

    setIsProcessing(true);
    try {
      // Create Payment Record
      await addDoc(collection(db, 'payments'), {
        userId: auth.currentUser.uid,
        amount: numAmount,
        currency: currency.code,
        symbol: currency.symbol,
        method: paymentMethod,
        type: 'wallet_topup',
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // Update User Balance
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        balance: walletBalance + numAmount
      });

      setShowDepositModal(false);
      setAmount('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'payments');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    if (numAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    if (!auth.currentUser) return;

    setIsProcessing(true);
    try {
      // Create Payment Record
      await addDoc(collection(db, 'payments'), {
        userId: auth.currentUser.uid,
        amount: -numAmount,
        currency: currency.code,
        symbol: currency.symbol,
        method: paymentMethod,
        type: 'withdrawal',
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // Update User Balance
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        balance: walletBalance - numAmount
      });

      setShowWithdrawModal(false);
      setAmount('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'payments');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
              className="h-20 w-20 rounded-full mx-auto border-4 border-emerald-50 mb-4"
              referrerPolicy="no-referrer"
            />
            <h2 className="font-bold text-gray-900">{user.displayName}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{user.role}</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'chats' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>My Chats</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>My Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'favorites' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span>Favorites</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'wallet' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>My Wallet</span>
          </button>

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">11. Database Tables</p>
              {dbTables.map((table) => (
                <button 
                  key={table.id}
                  onClick={() => setActiveTab(table.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === table.id ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <table.icon className={`h-4 w-4 ${activeTab === table.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{table.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 capitalize">{activeTab === 'orders' ? 'My Orders' : activeTab}</h3>
            </div>
            
            <div className="p-6">
              {user.role === 'user' && activeTab !== 'settings' && (
                <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-black">Ready to start selling?</h3>
                      <p className="text-emerald-50 text-sm opacity-90 max-w-md">
                        Open your seller account today and list your first product for free. Join our growing community!
                      </p>
                    </div>
                    <button 
                      onClick={handleBecomeSeller}
                      disabled={isProcessing}
                      className="whitespace-nowrap px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg active:scale-95 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <Store className="h-5 w-5" />
                      )}
                      <span>{isProcessing ? 'Processing...' : 'Open Seller Account'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'chats' && (
                <div className="space-y-4">
                  {chats.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No active conversations yet.</p>
                    </div>
                  ) : (
                    chats.map(chat => (
                      <div 
                        key={chat.id}
                        onClick={() => onOpenChat(chat)}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <UserIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Seller</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{chat.lastMessage || 'Start a conversation...'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            {chat.updatedAt ? formatDistanceToNow(new Date((chat.updatedAt as any).toDate())) + ' ago' : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>You haven't purchased anything yet.</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div 
                        key={order.id}
                        className="p-4 rounded-xl border border-gray-100 hover:border-emerald-100 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900">{order.productTitle}</h4>
                            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <span className="font-bold text-emerald-600">${order.price}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-12 text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Your wishlist is empty.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.displayName || ''}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      disabled
                      value={user.email || ''}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                  <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Save Changes
                  </button>

                  {user.role === 'user' && (
                    <div className="pt-8 mt-8 border-t border-gray-100">
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2">Become a Seller</h4>
                        <p className="text-sm text-emerald-700 mb-4">
                          Start selling your products on ONLINE BAZAR.PK and reach thousands of buyers.
                        </p>
                        <button 
                          onClick={handleBecomeSeller}
                          disabled={isProcessing}
                          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center space-x-2"
                        >
                          {isProcessing ? (
                            <>
                              <Clock className="h-5 w-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Store className="h-5 w-5" />
                              <span>Open Seller Account</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-3xl text-white shadow-xl">
                    <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
                    <p className="text-4xl font-black mt-2">${walletBalance.toFixed(2)}</p>
                    <div className="mt-8 flex space-x-4">
                      <button 
                        onClick={() => setShowDepositModal(true)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all"
                      >
                        <ArrowUpRight className="h-5 w-5 rotate-180" />
                        <span>Deposit</span>
                      </button>
                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">Recent Transactions</h4>
                    {transactions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No transactions yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-xl ${tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                <ArrowUpRight className={`h-5 w-5 ${tx.amount > 0 ? 'rotate-180' : ''}`} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 capitalize">{tx.type.replace('_', ' ')}</p>
                                <p className="text-xs text-gray-500">
                                  {tx.createdAt ? formatDistanceToNow(new Date(tx.createdAt.toDate())) + ' ago' : ''} • {tx.method}
                                </p>
                              </div>
                            </div>
                            <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.symbol || '$'}{Math.abs(tx.amount).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Database Tables */}
              {activeTab === 'admin_admins' && <AdminManagement />}
              {activeTab === 'admin_users' && <AdminUsers />}
              {activeTab === 'admin_sellers' && <AdminSellers />}
              {activeTab === 'admin_products' && <AdminAds />}
              {activeTab === 'admin_categories' && <AdminCategories />}
              {activeTab === 'admin_orders' && <AdminOrders />}
              {activeTab === 'admin_payments' && <AdminPayments />}
              {activeTab === 'admin_messages' && <AdminMessages />}
              {activeTab === 'admin_reviews' && <AdminReviews />}
              {activeTab === 'admin_reports' && <AdminReports />}
              {activeTab === 'admin_settings' && <AdminSettings />}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Deposit Money</h3>
              <button onClick={() => setShowDepositModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <Settings className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Currency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-between ${
                          currency.code === c.code 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="opacity-60">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Amount ({currency.symbol})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xl">
                      {currency.symbol}
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Payment Method</label>
                  <div className="space-y-2">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.name)}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center space-x-3 ${
                          paymentMethod === m.name 
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-600' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'
                        }`}
                      >
                        <m.icon className="h-5 w-5" />
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleDeposit}
                    disabled={isProcessing || !amount}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Deposit {currency.symbol}{amount || '0'} Now</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border-t-8 border-amber-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Withdraw Money</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-amber-600">
                <Settings className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Currency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-between ${
                          currency.code === c.code 
                            ? 'bg-amber-600 border-amber-600 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-amber-200'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="opacity-60">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Amount ({currency.symbol})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xl">
                      {currency.symbol}
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xl font-bold"
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Available Balance: ${walletBalance.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Withdrawal Method</label>
                  <div className="space-y-2">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.name)}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center space-x-3 ${
                          paymentMethod === m.name 
                            ? 'bg-amber-50 border-amber-600 text-amber-600' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-amber-200'
                        }`}
                      >
                        <m.icon className="h-5 w-5" />
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleWithdraw}
                    disabled={isProcessing || !amount || parseFloat(amount) > walletBalance}
                    className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amber-200 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Withdraw {currency.symbol}{amount || '0'} Now</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

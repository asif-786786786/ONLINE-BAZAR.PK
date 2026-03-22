import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, getDoc, setDoc, collection, query, where, onSnapshot, 
  orderBy, limit, addDoc, serverTimestamp, getDocs 
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { UserProfile, Product, Chat, OperationType } from './types';
import { handleFirestoreError } from './utils';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CategoryFilter } from './components/CategoryFilter';
import { ChatWindow } from './components/ChatWindow';
import { AdminPanel } from './components/AdminPanel';
import { SellerPanel } from './components/SellerPanel';
import { UserPanel } from './components/UserPanel';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, MapPin, User, Tag, Clock, ShieldCheck, Package, AlertTriangle, RefreshCw, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<'home' | 'user' | 'seller' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  useEffect(() => {
    console.log("App: Initializing auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("App: Auth state changed:", firebaseUser?.email || "No user");
      try {
        if (firebaseUser) {
          console.log("App: Fetching user document for:", firebaseUser.uid);
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const isSuperAdminEmail = firebaseUser.email === 'asif881480@gmail.com';
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            console.log("App: User document found, role:", userData.role);
            
            // Check for banned status
            if (userData.status === 'banned') {
              console.log("App: User is banned, logging out...");
              await logout();
              setUser(null);
              toast.error('Your account has been suspended. Please contact support.');
              return;
            }

            // Ensure role is updated if it's the super admin email
            if (isSuperAdminEmail && userData.role !== 'super_admin') {
              console.log("App: Updating super admin role for:", firebaseUser.email);
              const updatedUser = { ...userData, role: 'super_admin' as const };
              await setDoc(userDocRef, updatedUser, { merge: true });
              setUser(updatedUser);
              setActivePanel('admin');
            } else {
              setUser(userData);
              if (isSuperAdminEmail || userData.role === 'admin') setActivePanel('admin');
            }
          } else {
            console.log("App: Creating new user document for:", firebaseUser.email);
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: isSuperAdminEmail ? 'super_admin' : 'user',
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(userDocRef, newUser);
              console.log("App: New user document created");
              setUser(newUser);
              if (isSuperAdminEmail) setActivePanel('admin');
            } catch (err: any) {
              console.error("App: Error creating user document:", err);
              // If we can't create the doc, we still set the user state with basic info
              // so they aren't stuck on the login screen, but they won't have a role.
              setUser(newUser);
              toast.error("Profile created but some features may be limited. Please refresh.");
            }
          }
        } else {
          console.log("App: No user authenticated");
          setUser(null);
        }
      } catch (error: any) {
        console.error("App: Auth state change error:", error.code, error.message);
        toast.error("Error updating user profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("App: onAuthStateChanged error:", error);
      setLoading(false);
      toast.error("Authentication service error. Please refresh.");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let q = query(
      collection(db, 'products'), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (selectedCategory) {
      q = query(q, where('category', '==', selectedCategory));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.location.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleStartChat = async (product: Product) => {
    if (!user) {
      toast.error('Please login to chat with seller');
      return;
    }
    if (user.uid === product.sellerId) {
      toast.error('You cannot chat with yourself!');
      return;
    }

    try {
      // Check if chat already exists
      const q = query(
        collection(db, 'chats'),
        where('productId', '==', product.id),
        where('buyerId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setActiveChat({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Chat);
        setSelectedProduct(null);
        return;
      }

      // Create new chat
      const chatData = {
        productId: product.id,
        buyerId: user.uid,
        sellerId: product.sellerId,
        lastMessage: '',
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'chats'), chatData);
      setActiveChat({ id: docRef.id, ...chatData } as unknown as Chat);
      setSelectedProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 border-solid mx-auto"></div>
          <p className="text-emerald-600 font-bold text-lg animate-pulse">ONLINE BAZAR.PK Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" />
      
      <Header 
        user={user} 
        onSearch={setSearchQuery} 
        onLocationChange={setLocationQuery}
        onPanelChange={setActivePanel}
        isSuperAdmin={user?.role === 'super_admin'}
      />

      <main className="pb-20">
        {activePanel === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <section className="relative rounded-[2rem] overflow-hidden bg-emerald-900 text-white p-8 md:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="grid grid-cols-4 gap-4 transform rotate-12 scale-150">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-white rounded-2xl"></div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 max-w-2xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
                >
                  Buy & Sell <span className="text-emerald-400">Locally</span> with Confidence.
                </motion.h1>
                <p className="text-lg md:text-xl text-emerald-100 mb-8 opacity-90">
                  Join thousands of people in your community trading pre-loved items. Fast, safe, and sustainable.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActivePanel('seller')}
                    className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
                  >
                    Start Selling
                  </button>
                  <button 
                    onClick={() => {
                      const featuredSection = document.getElementById('featured-section');
                      featuredSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all border border-emerald-700 active:scale-95"
                  >
                    Browse Deals
                  </button>
                </div>
              </div>
            </section>

            {/* Featured Section */}
            {products.filter(p => p.isFeatured && p.status === 'approved').length > 0 && (
              <section id="featured-section" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 text-amber-500 fill-current" />
                    <h2 className="text-2xl font-bold text-gray-900">Featured Deals</h2>
                  </div>
                  <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products
                    .filter(p => p.isFeatured && p.status === 'approved')
                    .slice(0, 4)
                    .map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={setSelectedProduct} 
                      />
                    ))}
                </div>
              </section>
            )}

            {/* Categories */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <CategoryFilter selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
            </section>

            {/* Product Grid */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? `Deals in ${selectedCategory}` : 'Featured Listings'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Sort by:</span>
                  <select className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  <Package className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
                  <button 
                    onClick={() => {setSelectedCategory(null); setSearchQuery(''); setLocationQuery('');}}
                    className="mt-4 text-emerald-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={setSelectedProduct} 
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activePanel === 'user' && user && <UserPanel user={user} onOpenChat={setActiveChat} />}
        {activePanel === 'seller' && user && <SellerPanel user={user} />}
        {activePanel === 'admin' && user && (user.role === 'admin' || user.role === 'super_admin') && <AdminPanel />}
        
        {/* Auth Guard for Panels */}
        {(activePanel === 'user' || activePanel === 'seller' || activePanel === 'admin') && !user && (
          <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <User className="h-16 w-16 mx-auto text-emerald-100 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-500 mb-8">Please sign in to access your dashboard and manage your listings.</p>
            <button 
              disabled={isAuthActionLoading}
              onClick={async () => {
                if (isAuthActionLoading) return;
                setIsAuthActionLoading(true);
                try {
                  console.log("Auth Guard: Starting login process...");
                  if (!auth) {
                    throw new Error("Firebase Auth not initialized");
                  }
                  const user = await signInWithGoogle();
                  if (user) {
                    console.log("Auth Guard: Login successful for:", user.email);
                    setActivePanel('home');
                    toast.success('Logged in successfully!');
                  } else {
                    console.warn("Auth Guard: Login completed but no user returned");
                  }
                } catch (error: any) {
                  console.error('Auth Guard: Login Error:', error);
                  if (error.code === 'auth/popup-blocked') {
                    toast.error('Login popup was blocked. Please check your browser settings and allow popups for this site.', {
                      duration: 6000,
                      position: 'top-center'
                    });
                  } else if (error.code === 'auth/cancelled-popup-request') {
                    console.log("Auth Guard: User cancelled login popup");
                  } else if (error.code === 'auth/popup-closed-by-user') {
                    toast.error('Login window was closed before completion.');
                  } else if (error.code === 'auth/network-request-failed') {
                    toast.error('Network error. Please check your connection.');
                  } else {
                    toast.error(`Login failed: ${error.message || 'Unknown error'}. Please try again.`);
                  }
                } finally {
                  setIsAuthActionLoading(false);
                }
              }}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAuthActionLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in with Google</span>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left: Image Gallery */}
              <div className="w-full md:w-3/5 bg-gray-100 relative">
                <img 
                  src={selectedProduct.images[0]} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 left-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-white transition-all shadow-lg md:hidden"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto space-y-8">
                <div className="hidden md:flex justify-end">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.status === 'approved' && (
                      <span className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verified Listing</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-4xl font-black text-emerald-600">
                    ${selectedProduct.price.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Location</p>
                      <p className="text-sm font-bold">{selectedProduct.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg"><Clock className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Posted</p>
                      <p className="text-sm font-bold">{formatDistanceToNow(new Date(selectedProduct.createdAt))} ago</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                      {selectedProduct.sellerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Seller</p>
                      <p className="font-bold text-gray-900">{selectedProduct.sellerName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartChat(selectedProduct)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chat with Seller</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Chat Window */}
      {activeChat && (
        <ChatWindow chat={activeChat} onClose={() => setActiveChat(null)} />
      )}
      </div>
  );
}

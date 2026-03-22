import React, { useState } from 'react';
import { Search, MapPin, LogIn, LogOut, User, PlusCircle, MessageCircle, Shield, RefreshCw } from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../firebase';
import { UserProfile } from '../types';

import { toast } from 'react-hot-toast';

interface HeaderProps {
  user: UserProfile | null;
  onSearch: (query: string) => void;
  onLocationChange: (loc: string) => void;
  onPanelChange: (panel: 'home' | 'user' | 'seller' | 'admin') => void;
  isSuperAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onSearch, onLocationChange, onPanelChange, isSuperAdmin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      console.log("Header: Starting login process...");
      if (!auth) {
        throw new Error("Firebase Auth not initialized");
      }
      const user = await signInWithGoogle();
      if (user) {
        console.log("Header: Login successful for:", user.email);
        toast.success('Welcome back!');
      } else {
        console.warn("Header: Login completed but no user returned");
      }
    } catch (error: any) {
      console.error('Header: Login Error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Login popup was blocked. Please check your browser settings and allow popups for this site.', {
          duration: 6000,
          position: 'top-center'
        });
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Header: User cancelled login popup");
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Login window was closed before completion.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Login failed: ${error.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onPanelChange('home')}>
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">ONLINE BAZAR.PK</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <div className="relative w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="Location"
                onChange={(e) => onLocationChange(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button 
                  onClick={() => onPanelChange('user')}
                  className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Messages"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <button 
                    onClick={() => onPanelChange('admin')}
                    className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                    title={user.role === 'super_admin' ? "Super Admin Panel" : "Admin Panel"}
                  >
                    <Shield className="h-6 w-6" />
                  </button>
                )}

                <button 
                  onClick={() => onPanelChange('seller')}
                  className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>{user.role === 'user' ? 'Open Seller Account' : 'Sell'}</span>
                </button>

                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full border-2 border-emerald-100"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-all">
                    <button 
                      onClick={() => onPanelChange('user')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      My Profile
                    </button>
                    {user.role === 'user' && (
                      <button 
                        onClick={() => onPanelChange('seller')}
                        className="block px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100 w-full text-left font-medium"
                      >
                        Open Seller Account
                      </button>
                    )}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <button 
                        onClick={() => onPanelChange('admin')}
                        className="block px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100 w-full text-left font-medium"
                      >
                        {user.role === 'super_admin' ? "Super Admin Panel" : "Admin Panel"}
                      </button>
                    )}
                    <button 
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button 
                disabled={isLoggingIn}
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-full font-medium hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

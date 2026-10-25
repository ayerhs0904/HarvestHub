import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  Flame, 
  CalendarClock, 
  Users, 
  ClipboardList, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, isAuthenticated, isBuyer, isFarmer, isAdmin, logout, login } = useAuth();
  const { cartCount } = useCart();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (roleType) => {
    try {
      if (roleType === 'ADMIN') {
        await login('admin@harvesthub.farm', 'password123');
        navigate('/admin/dashboard');
      } else if (roleType === 'FARMER') {
        await login('farmer.green@harvesthub.farm', 'password123');
        navigate('/farmer/dashboard');
      } else if (roleType === 'BUYER') {
        await login('buyer.shreya@harvesthub.farm', 'password123');
        navigate('/marketplace');
      }
      setDemoDropdownOpen(false);
    } catch (err) {
      alert('Demo switch error: ' + err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-forest-700/95 backdrop-blur-md border-b border-forest-600 text-white shadow-soft">
      {/* Top micro-banner */}
      <div className="bg-forest-800/80 px-4 py-1 text-xs text-forest-100 flex items-center justify-between border-b border-forest-700/60">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Harvest Hub Live Platform: 100% Traceable Direct Agricultural Supply</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
            className="flex items-center gap-1 font-medium text-sage-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Switcher</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {demoDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-elevated border border-slate-100 py-2 z-50 text-sm">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Switch Demo Persona
              </div>
              <button
                onClick={() => handleDemoSwitch('BUYER')}
                className="w-full text-left px-3 py-2 hover:bg-cream-100 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <div className="font-medium text-slate-900">Shreya Sen (Buyer)</div>
                  <div className="text-xs text-slate-500">Shop, Reserve & Group Buy</div>
                </div>
              </button>
              <button
                onClick={() => handleDemoSwitch('FARMER')}
                className="w-full text-left px-3 py-2 hover:bg-cream-100 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <div>
                  <div className="font-medium text-slate-900">Rajesh Patel (Farmer)</div>
                  <div className="text-xs text-slate-500">Green Valley Organic Estate</div>
                </div>
              </button>
              <button
                onClick={() => handleDemoSwitch('ADMIN')}
                className="w-full text-left px-3 py-2 hover:bg-cream-100 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <div className="font-medium text-slate-900">Platform Admin</div>
                  <div className="text-xs text-slate-500">Verify Farms & Review Audits</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-600 flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1">
                Harvest<span className="text-sage-300">Hub</span>
              </span>
              <span className="block text-[10px] font-medium tracking-wide text-forest-200 uppercase -mt-1">
                Smart Farm-to-Market
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/marketplace') ? 'bg-forest-600 text-white font-semibold' : 'text-forest-100 hover:text-white hover:bg-forest-600/50'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/surplus-rescue"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/surplus-rescue') ? 'bg-amber-500 text-white font-semibold' : 'text-amber-300 hover:text-amber-200 hover:bg-forest-600/50'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Surplus Rescue</span>
            </Link>
            <Link
              to="/harvest-reservations"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/harvest-reservations') ? 'bg-forest-600 text-white font-semibold' : 'text-forest-100 hover:text-white hover:bg-forest-600/50'
              }`}
            >
              <CalendarClock className="w-4 h-4 text-emerald-400" />
              <span>Pre-Harvest</span>
            </Link>
            <Link
              to="/community-buys"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/community-buys') ? 'bg-forest-600 text-white font-semibold' : 'text-forest-100 hover:text-white hover:bg-forest-600/50'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Group Buying</span>
            </Link>
            <Link
              to="/demand-board"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/demand-board') ? 'bg-forest-600 text-white font-semibold' : 'text-forest-100 hover:text-white hover:bg-forest-600/50'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-sage-300" />
              <span>Demand Board</span>
            </Link>
          </nav>

          {/* Right Action Icons: Notifications, Cart, Profile */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-600/60 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-forest-700 animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-elevated border border-slate-100 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="font-display font-bold text-sm text-slate-900">Notifications</span>
                      <span className="text-xs bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.linkUrl) navigate(n.linkUrl);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                              n.isRead ? 'bg-slate-50 hover:bg-slate-100 text-slate-600' : 'bg-forest-50 hover:bg-forest-100/80 text-forest-900 font-medium border-l-4 border-forest-600'
                            }`}
                          >
                            <div className="font-bold mb-0.5">{n.title}</div>
                            <div className="text-[11px] leading-relaxed text-slate-500">{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="p-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-600/60 transition-colors relative flex items-center"
              title="Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-forest-700">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Session Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-500 transition-colors border border-forest-500/80"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-white max-w-[100px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-forest-200" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-elevated border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {user?.role?.replace('ROLE_', '')}
                      </span>
                    </div>

                    {isFarmer && (
                      <Link
                        to="/farmer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-cream-100 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-forest-600" />
                        <span>Farmer Dashboard</span>
                      </Link>
                    )}

                    {isBuyer && (
                      <Link
                        to="/buyer/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-cream-100 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-forest-600" />
                        <span>My Orders & Bookings</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-cream-100 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Audit Center</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white hover:bg-forest-600/70 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-forest-950 transition-all shadow-sm hover:shadow"
                >
                  Join as Producer/Buyer
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-forest-100 hover:bg-forest-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-forest-600 bg-forest-800 text-sm space-y-2">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-forest-100 hover:text-white"
          >
            Marketplace
          </Link>
          <Link
            to="/surplus-rescue"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-300 font-semibold"
          >
            Surplus Food Rescue
          </Link>
          <Link
            to="/harvest-reservations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-forest-100 hover:text-white"
          >
            Pre-Harvest Reservations
          </Link>
          <Link
            to="/community-buys"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-forest-100 hover:text-white"
          >
            Community Group Buying
          </Link>
          <Link
            to="/demand-board"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-forest-100 hover:text-white"
          >
            Crop Demand Board
          </Link>
        </div>
      )}
    </header>
  );
}

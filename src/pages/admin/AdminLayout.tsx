import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Image as ImageIcon,
  Tag,
  Star,
  Users,
  CreditCard,
  BarChart3,
  Boxes,
  Truck,
  Settings,
  LogOut,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Guard: Strictly allow only admin email
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border border-rose-900/40 p-8 rounded-3xl text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="font-serif font-bold text-2xl">Access Denied</h2>
          <p className="text-xs text-stone-400">
            You are logged in as <strong className="text-stone-200">{user?.email || 'Guest'}</strong>. Only an authorised administrator account has access to the Enterprise Admin Panel.
          </p>
          <Link
            to="/"
            className="bg-[#FF7A00] text-white font-bold text-xs px-6 py-3 rounded-xl shadow inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Website Homepage
          </Link>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Delivery Map', path: '/admin/delivery', icon: Truck },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 shrink-0 hidden md:flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Header */}
          <Link to="/" className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center text-white text-xl font-bold font-serif">
              🪔
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-[#FF7A00]">
                Sri Vigneshwara
              </h1>
              <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block">
                Enterprise Seller Hub
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF7A00] text-white shadow-lg'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-stone-800 space-y-3 px-2">
          <div className="text-[11px] text-stone-400 truncate">
            <p className="font-bold text-stone-200">Admin Account</p>
            <p className="text-[10px] truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            className="w-full text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 p-2 rounded-xl flex items-center justify-center gap-2 font-bold"
          >
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Mobile & Quick Actions */}
        <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Master Admin Mode Active
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3 py-1.5 rounded-lg transition-colors border border-stone-700"
          >
            View Live Customer Storefront ↗
          </Link>
        </header>

        {/* Dynamic Admin Sub-Page */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

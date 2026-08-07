import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Truck,
  ShieldCheck,
  Globe,
  Sparkles,
  LayoutDashboard,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import InstantSearchModal from './InstantSearchModal';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cartItems, wishlistIds } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: '🪔 Explore Idols Dashboard', path: '/products' },
    { label: t('categories'), path: '/products#categories' },
    { label: t('offers'), path: '/products?offers=true' },
    { label: t('trackOrder'), path: '/track-order' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
  ];

  return (
    <>
      {/* Top Banner with Store Address & Delivery Info */}
      <div className="bg-[#FF7A00] text-white text-xs py-2 px-4 font-medium z-50 relative border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center space-x-2">
            <Truck className="w-3.5 h-3.5 animate-bounce shrink-0" />
            <span className="font-semibold">{t('deliveryBanner')}</span>
            <span className="hidden sm:inline font-bold bg-white/20 px-2 py-0.5 rounded text-[10px]">
              Vijayawada
            </span>
          </div>

          {/* Top Pop-Up Store Address */}
          <div className="flex items-center justify-center space-x-1.5 text-[11px] bg-black/20 px-3 py-1 rounded-full text-[#FFD54F]">
            <MapPin className="w-3.5 h-3.5 text-[#FFD54F] shrink-0" />
            <span className="font-bold">Store Address:</span>
            <span className="truncate max-w-xs sm:max-w-none">
              D.No. 73-1-5, MG Road, Patamata, Opp. High School Road Bus Stop, Vijayawada - 520010
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD54F]" /> 100% Ganga Water Clay
            </span>
            <a href="tel:9390538027" className="hover:underline font-bold text-[#FFD54F]">
              📞 9390538027
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isHomePage && !isScrolled
            ? 'bg-amber-950/40 text-white backdrop-blur-md border-b border-white/10'
            : 'bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 shadow-md backdrop-blur-md border-b border-stone-200 dark:border-stone-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFD54F] p-0.5 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/favicon.png" alt="Sri Vigneshwara Mitti Idols logo" className="w-full h-full rounded-full object-cover bg-stone-900" />
                <div className="hidden">
                  🪔
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#FF7A00] leading-tight">
                  Sri Vigneshwara
                </span>
                <span className="text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-medium">
                  Mitti Idols • Vijayawada
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-[#FF7A00] transition-colors py-1 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF7A00] transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Language Selector */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-1 text-xs border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded transition-colors ${
                    language === 'en'
                      ? 'bg-[#FF7A00] text-white font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2 py-1 rounded transition-colors ${
                    language === 'te'
                      ? 'bg-[#FF7A00] text-white font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  తెలుగు
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-amber-600 dark:text-amber-400"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-stone-700" />}
              </button>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search idols"
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                aria-label="Cart"
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative text-[#FF7A00]"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account / Admin Button */}
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-[#FF7A00] to-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow hover:opacity-90 transition-opacity"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              ) : user ? (
                <Link
                  to="/profile"
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-amber-600"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#FF7A00] hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow"
                >
                  {t('login')}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-stone-800 dark:text-stone-200"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md bg-[#FF7A00] text-white font-bold text-center"
                >
                  Open Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      {searchOpen && <InstantSearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

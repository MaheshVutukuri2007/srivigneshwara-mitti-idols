import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { checkAndSeedInitialData } from './lib/seedData';

// Public Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import InstantSearchModal from './components/InstantSearchModal';
import VisarjanGuideModal from './components/VisarjanGuideModal';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminInventory from './pages/admin/AdminInventory';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminSettings from './pages/admin/AdminSettings';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisarjanOpen, setIsVisarjanOpen] = useState(false);

  useEffect(() => {
    // Ensure initial store settings are saved and clear any demo data
    checkAndSeedInitialData().catch((err) => console.error('Setup error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Show Public Header & Footer only on non-admin routes */}
      {!isAdminRoute && (
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenVisarjanGuide={() => setIsVisarjanOpen(true)}
        />
      )}

      <main className="flex-1">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage onOpenVisarjan={() => setIsVisarjanOpen(true)} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policy/:type" element={<PolicyPage />} />

          {/* Admin Enterprise Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {/* Floating Utilities */}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Modals */}
      {isSearchOpen && <InstantSearchModal onClose={() => setIsSearchOpen(false)} />}
      {isVisarjanOpen && <VisarjanGuideModal onClose={() => setIsVisarjanOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

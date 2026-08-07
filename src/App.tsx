import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import InstantSearchModal from './components/InstantSearchModal';
import VisarjanGuideModal from './components/VisarjanGuideModal';

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminDelivery = lazy(() => import('./pages/admin/AdminDelivery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisarjanOpen, setIsVisarjanOpen] = useState(false);

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
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-sm font-bold text-stone-500">Loading...</div>}>
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
        </Suspense>
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

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, MapPin, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import OrderTimeline from '../components/OrderTimeline';
import InvoiceModal from '../components/InvoiceModal';

export default function ProfilePage() {
  const { user, customerProfile, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Banner */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF7A00] to-amber-500 flex items-center justify-center text-white text-2xl font-bold font-serif shadow">
              {customerProfile?.name ? customerProfile.name[0].toUpperCase() : 'D'}
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                {customerProfile?.name || 'Devotee Account'}
              </h1>
              <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                <span><Mail className="w-3.5 h-3.5 inline mr-1" />{user.email}</span>
                {customerProfile?.phone && <span>• <Phone className="w-3.5 h-3.5 inline mr-1" />{customerProfile.phone}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* My Orders */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-xl flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Package className="w-5 h-5 text-[#FF7A00]" /> My Ganesh Idol Orders ({orders.length})
          </h2>

          {loadingOrders ? (
            <div className="text-xs text-stone-500 py-6">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500 space-y-2">
              <p>You have not placed any orders yet.</p>
              <Link to="/products" className="bg-[#FF7A00] text-white font-bold px-4 py-2 rounded-xl inline-block">
                Shop Ganesh Idols
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-3">
                    <div>
                      <span className="font-mono text-[#FF7A00] font-bold text-sm">#{order.orderNumber}</span>
                      <span className="text-stone-400 ml-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-amber-100 text-[#FF7A00] px-2.5 py-0.5 rounded-full font-bold">
                        {order.orderStatus}
                      </span>
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>
                  </div>

                  <OrderTimeline currentStatus={order.orderStatus} statusHistory={order.statusHistory} />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-stone-600">Items: {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}</span>
                    <span className="font-extrabold text-[#FF7A00] text-sm">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
}

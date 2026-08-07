import React, { useState } from 'react';
import { Search, PackageCheck, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import OrderTimeline from '../components/OrderTimeline';
import { useAuth } from '../context/AuthContext';

export default function TrackOrderPage() {
  const { user } = useAuth();
  const [orderQuery, setOrderQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    if (!user) {
      setFoundOrder(null);
      setErrorMsg('Please sign in with the account used to place this order.');
      return;
    }
    setSearching(true);
    setErrorMsg('');
    setFoundOrder(null);

    // Order numbers are shown with a leading '#' in a few customer screens.
    // Accept either format when customers paste or type the number here.
    const term = orderQuery.trim().toUpperCase().replace(/^#\s*/, '');

    try {
      // Firestore permits customers to read only their own orders. Fetch that
      // scoped list first, then match the order number or phone locally.
      const ownOrdersQuery = query(collection(db, 'orders'), where('customerId', '==', user.uid));
      const snap = await getDocs(ownOrdersQuery);
      const normalizedPhone = orderQuery.trim().replace(/\D/g, '');
      const matchingOrder = snap.docs.find((orderDoc) => {
        const order = orderDoc.data() as Order;
        return order.orderNumber?.toUpperCase() === term || order.phone?.replace(/\D/g, '') === normalizedPhone;
      });

      if (matchingOrder) {
        setFoundOrder({ id: matchingOrder.id, ...matchingOrder.data() } as Order);
      } else {
        setErrorMsg('No delivery order found matching this Order Number or Phone Number.');
      }
    } catch (err) {
      console.error('Error searching order:', err);
      setErrorMsg('Failed to search order status.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-2xl">🚚</span>
          <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100">
            Track Vijayawada Doorstep Order
          </h1>
          <p className="text-xs text-stone-500">
            Enter your Order Number (e.g. SVM-123456) or your Mobile Phone Number to see live progress.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchOrder} className="bg-[#FFFDF7] dark:bg-stone-900 p-4 rounded-2xl border border-amber-900/10 shadow-sm flex gap-2">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Order Number (e.g. SVM-982143) or Mobile Number..."
            className="flex-1 text-xs p-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none uppercase font-mono"
            required
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-[#FF7A00] text-white font-bold text-xs px-6 py-3 rounded-xl shadow flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span>{searching ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Card */}
        {foundOrder && (
          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-2">
              <div>
                <span className="text-xs font-mono text-stone-400">Order ID: {foundOrder.orderNumber}</span>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Recipient: {foundOrder.customerName}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-[#FF7A00] rounded-full w-fit">
                Status: {foundOrder.orderStatus}
              </span>
            </div>

            <OrderTimeline currentStatus={foundOrder.orderStatus} statusHistory={foundOrder.statusHistory} />

            <div className="text-xs text-stone-600 space-y-1 bg-stone-100 dark:bg-stone-800 p-4 rounded-xl">
              <p><strong>Delivery Address:</strong> {foundOrder.deliveryAddress.street}, {foundOrder.deliveryAddress.area}, Vijayawada - {foundOrder.deliveryAddress.pincode}</p>
              <p><strong>Items Ordered:</strong> {foundOrder.items.map((i) => `${i.name} (Qty ${i.quantity})`).join(', ')}</p>
              <p><strong>Total Amount:</strong> ₹{foundOrder.totalAmount} ({foundOrder.paymentMethod.toUpperCase()})</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

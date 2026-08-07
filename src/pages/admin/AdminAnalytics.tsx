import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../types';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const codSales = orders.filter((o) => o.paymentMethod === 'cod').reduce((sum, o) => sum + o.totalAmount, 0);
  const onlineSales = orders.filter((o) => o.paymentMethod === 'upi_qr').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Sales & Revenue Analytics</h1>
        <p className="text-xs text-stone-400 mt-1">Breakdown of online vs COD sales performance in Vijayawada.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <span className="text-stone-400 text-xs">Total Gross Sales</span>
          <p className="font-extrabold text-2xl text-[#FF7A00]">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <span className="text-stone-400 text-xs">UPI QR Payment Revenue</span>
          <p className="font-extrabold text-2xl text-emerald-400">₹{onlineSales.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <span className="text-stone-400 text-xs">Cash on Delivery (COD) Revenue</span>
          <p className="font-extrabold text-2xl text-amber-400">₹{codSales.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}

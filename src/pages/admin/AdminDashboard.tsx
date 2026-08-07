import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Tag,
  Boxes,
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, Product, Customer } from '../../types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const orderSnap = await getDocs(collection(db, 'orders'));
        const prodSnap = await getDocs(collection(db, 'products'));
        const custSnap = await getDocs(collection(db, 'customers'));

        setOrders(orderSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
        setProducts(prodSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
        setCustomers(custSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer)));
      } catch (err) {
        console.error('Error fetching admin KPIs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  // Compute Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const completedCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledCount = orders.filter((o) => o.orderStatus === 'Cancelled').length;

  const lowStockProds = products.filter((p) => p.stock <= 5);

  if (loading) {
    return <div className="text-xs text-stone-400 py-8">Loading enterprise dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">
          Executive Admin Dashboard
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Real-time Vijayawada eco idol sales analytics, inventory status, and active delivery pipelines.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <p className="font-extrabold text-2xl text-stone-100">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 font-bold">Today: +₹{todayRevenue}</span>
        </div>

        {/* Total Orders */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-extrabold text-2xl text-stone-100">{orders.length}</p>
          <span className="text-[10px] text-amber-400 font-bold">Today: {todayOrders.length} New Orders</span>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Pending Deliveries</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-extrabold text-2xl text-amber-400">{pendingCount}</p>
          <span className="text-[10px] text-stone-400">Needs dispatch coordination</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-extrabold text-2xl text-rose-400">{lowStockProds.length}</p>
          <span className="text-[10px] text-rose-400">Products under 5 stock</span>
        </div>
      </div>

      {/* Recent Orders Table & Low Stock Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-100 flex items-center justify-between">
            <span>Recent Customer Orders</span>
            <span className="text-xs font-mono text-[#FF7A00]">{orders.length} Total</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400">
                  <th className="py-2">Order #</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 font-mono font-bold text-[#FF7A00]">{ord.orderNumber}</td>
                    <td className="py-3 font-bold">{ord.customerName}</td>
                    <td className="py-3 font-extrabold">₹{ord.totalAmount}</td>
                    <td className="py-3">
                      <span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-bold text-[10px]">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-100 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-rose-500" /> Low Stock Warning
          </h3>

          <div className="space-y-3 text-xs">
            {lowStockProds.length === 0 ? (
              <p className="text-stone-500 text-center py-6">All idol stock levels healthy.</p>
            ) : (
              lowStockProds.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-stone-800/50 rounded-xl">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-stone-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-stone-400">{p.heightInInches}" • {p.material}</p>
                  </div>
                  <span className="bg-rose-950 text-rose-400 font-extrabold px-2 py-1 rounded text-[11px]">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

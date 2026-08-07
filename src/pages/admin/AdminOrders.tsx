import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Printer, CheckCircle, Search, Filter } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, OrderStatus } from '../../types';
import InvoiceModal from '../../components/InvoiceModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const target = orders.find((o) => o.id === orderId);
      if (!target) return;

      const newHistory = [
        ...(target.statusHistory || []),
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Status updated by Admin to ${newStatus}`,
        },
      ];

      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        statusHistory: newHistory,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus, statusHistory: newHistory } : o))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(term);
      const matchName = o.customerName.toLowerCase().includes(term);
      const matchPhone = o.phone.includes(term);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-extrabold text-2xl text-stone-100">
            Customer Orders Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Dispatch, track delivery status, and view GPS navigation pins for Vijayawada orders.
          </p>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order #, Name, Phone..."
            className="w-full p-2.5 pl-8 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-200"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-800 text-stone-200 p-2 rounded-xl border border-stone-700 outline-none font-bold"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing / Packing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-xs text-stone-400 py-8">Loading customer orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-stone-900 p-12 rounded-2xl border border-stone-800 text-center text-xs text-stone-500">
          No orders found matching criteria.
        </div>
      ) : (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/50 text-stone-400 font-bold uppercase">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Delivery Address & GPS</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Update Status</th>
                  <th className="py-3 px-4">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#FF7A00]">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-stone-500 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-100">{ord.customerName}</p>
                      <a href={`tel:${ord.phone}`} className="text-[#FF7A00] font-bold">📞 {ord.phone}</a>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-stone-300 truncate">{ord.deliveryAddress.street}, {ord.deliveryAddress.area}</p>
                      {ord.location?.googleMapsUrl && (
                        <a
                          href={ord.location.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 font-bold underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <MapPin className="w-3.5 h-3.5" /> Navigate in Maps
                        </a>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-200">{ord.items.length} Idol(s)</p>
                      <p className="text-[10px] text-stone-400 truncate max-w-[150px]">
                        {ord.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-stone-100">
                      ₹{ord.totalAmount}
                      <span className="block text-[10px] text-emerald-400 font-bold uppercase">{ord.paymentMethod}</span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-stone-800 text-stone-100 p-1.5 rounded-lg border border-stone-700 outline-none font-bold text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing Idol</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold p-2 rounded-lg border border-stone-700"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
}

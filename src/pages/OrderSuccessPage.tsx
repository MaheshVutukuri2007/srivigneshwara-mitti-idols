import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, FileText, MapPin, Truck, Home, Sparkles } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import OrderTimeline from '../components/OrderTimeline';
import InvoiceModal from '../components/InvoiceModal';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const ref = doc(db, 'orders', orderId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() } as Order);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-12 text-center text-stone-500">Loading order status...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-12 text-center space-y-4">
        <h2 className="font-serif font-bold text-xl">Order Not Found</h2>
        <Link to="/" className="bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-xs font-bold inline-block">Return to Home</Link>
      </div>
    );
  }

  const handleWhatsAppShareOrder = () => {
    const text = encodeURIComponent(
      `Namaste Sri Vigneshwara Mitti Idols! My Order ID is ${order.orderNumber}. Name: ${order.customerName}. Items: ${order.items.map(i => i.name).join(', ')}. Delivery Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.area}, Vijayawada.`
    );
    window.open(`https://wa.me/919390538027?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> Order Confirmed
            </span>
            <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100">
              Ganapati Bappa Morya!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Thank you, <strong className="text-stone-800 dark:text-stone-200">{order.customerName}</strong>. Your eco clay Ganesh idol order is being prepared!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-stone-800 px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-stone-700">
            <span>Order Number:</span>
            <span className="font-mono text-[#FF7A00] text-sm">{order.orderNumber}</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleWhatsAppShareOrder}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Share Order on WhatsApp
            </button>

            <button
              onClick={() => setShowInvoice(true)}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Download / Print Tax Invoice
            </button>
          </div>
        </div>

        {/* Live Timeline Tracker */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-md space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-3">
            Live Delivery Order Tracker (Vijayawada)
          </h3>
          <OrderTimeline currentStatus={order.orderStatus} statusHistory={order.statusHistory} />
        </div>

        {/* Order Details Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-2">
              Delivery Address
            </h4>
            <p className="font-bold">{order.customerName}</p>
            <p className="text-stone-600">{order.deliveryAddress.street}, {order.deliveryAddress.landmark}, {order.deliveryAddress.area}, Vijayawada - {order.deliveryAddress.pincode}</p>
            <p className="text-stone-600">Phone: {order.phone}</p>
            {order.location?.googleMapsUrl && (
              <a
                href={order.location.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 font-bold underline flex items-center gap-1 pt-1"
              >
                <MapPin className="w-3.5 h-3.5" /> View Pinned GPS Location on Google Maps
              </a>
            )}
          </div>

          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-2">
              Payment & Summary
            </h4>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-bold uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#FF7A00] text-sm pt-2 border-t border-stone-200">
              <span>Total Paid:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}
    </div>
  );
}

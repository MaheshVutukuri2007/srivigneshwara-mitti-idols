import React from 'react';
import { X, Printer, Download, CheckCircle, MapPin, Phone } from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface InvoiceModalProps {
  order: Order;
  settings?: StoreSettings | null;
  onClose: () => void;
}

export default function InvoiceModal({ order, settings, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-stone-900 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 border border-stone-200">
        {/* Action Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Tax Invoice & Order Receipt</span>
            <span className="bg-[#FF7A00] text-xs px-2 py-0.5 rounded font-mono">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-stone-800 text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 text-sm" id="printable-invoice">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6 border-stone-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🪔</span>
                <span className="font-serif font-bold text-xl text-[#FF7A00]">
                  {settings?.storeName || 'Sri Vigneshwara Mitti Idols'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                {settings?.storeAddress || 'D.No. 73-1-5, MG Road, Patamata, Opp. High School Road Bus Stop, Vijayawada - 520010'}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Phone: {settings?.phone || '9390538027'} | WhatsApp: 9390538027
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-xl font-bold font-serif text-stone-800">INVOICE</h2>
              <p className="text-xs text-stone-500 mt-1">Invoice No: <span className="font-mono font-bold">{order.orderNumber}</span></p>
              <p className="text-xs text-stone-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              <p className="text-xs font-bold text-emerald-600 mt-1">Status: PAID ({order.paymentMethod.toUpperCase()})</p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase">Customer Details</h4>
              <p className="font-bold text-stone-900 mt-1">{order.customerName}</p>
              <p className="text-xs text-stone-600">{order.customerEmail}</p>
              <p className="text-xs text-stone-600 font-medium">📞 Phone: {order.phone}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase">Vijayawada Delivery Location</h4>
              <p className="text-xs text-stone-800 mt-1 leading-snug font-medium">
                {order.deliveryAddress.street}, {order.deliveryAddress.landmark}, {order.deliveryAddress.area}, Vijayawada - {order.deliveryAddress.pincode}
              </p>
              {order.location?.googleMapsUrl && (
                <a
                  href={order.location.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-700 font-semibold underline mt-1 inline-block"
                >
                  📍 Open GPS Pin in Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-300 text-xs text-stone-500 font-bold uppercase">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 pr-2">
                    <p className="font-bold text-stone-900">{item.name}</p>
                    <p className="text-[10px] text-stone-500">{item.heightInInches} Inch • {item.material}</p>
                  </td>
                  <td className="py-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.price}</td>
                  <td className="py-3 text-right font-bold">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Breakdown */}
          <div className="border-t border-stone-300 pt-4 flex justify-end text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Doorstep Delivery (Vijayawada):</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#FF7A00] border-t border-stone-300 pt-2">
                <span>Grand Total:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-6 border-t border-dashed border-stone-200 text-xs text-stone-500 space-y-1">
            <p className="font-bold text-stone-700">Thank you for choosing Eco-Friendly Ganesh Idols!</p>
            <p>100% Water Dissolvable Clay • Protect Vijayawada Waters • Ganapati Bappa Morya!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

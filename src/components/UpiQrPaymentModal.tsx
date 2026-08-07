import React, { useMemo, useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, QrCode, X } from 'lucide-react';
import { Order } from '../types';

interface UpiQrPaymentModalProps {
  order: Order;
  upiId: string;
  payeeName: string;
  onPaymentSubmitted: (reference: string) => void;
  onClose: () => void;
}

export default function UpiQrPaymentModal({
  order,
  upiId,
  payeeName,
  onPaymentSubmitted,
  onClose,
}: UpiQrPaymentModalProps) {
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: order.totalAmount.toFixed(2),
      cu: 'INR',
      tn: `Order ${order.orderNumber}`,
    });
    return `upi://pay?${params.toString()}`;
  }, [order.orderNumber, order.totalAmount, payeeName, upiId]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUrl)}`;

  const copyUpiId = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF7] dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden">
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif font-extrabold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#FF7A00]" /> Pay by UPI QR
            </h3>
            <p className="text-xs text-stone-500 mt-1">Scan with any UPI app to complete your order payment.</p>
          </div>
          <button onClick={onClose} aria-label="Close payment QR" className="text-stone-400 hover:text-stone-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="inline-block rounded-2xl bg-white p-3 border border-stone-200 shadow-sm">
            <img src={qrImageUrl} alt={`UPI QR code to pay ₹${order.totalAmount}`} className="w-56 h-56" />
          </div>
          <p className="font-extrabold text-2xl text-[#FF7A00]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-stone-500">Order {order.orderNumber}</p>

          <div className="text-left bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 border border-amber-200/70 dark:border-amber-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Pay to</p>
            <p className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">{payeeName}</p>
            <button type="button" onClick={copyUpiId} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:underline">
              {upiId} <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy UPI ID'}
            </button>
          </div>

          <a href={upiUrl} className="sm:hidden w-full py-3 rounded-xl border border-[#FF7A00] text-[#FF7A00] font-bold text-sm flex justify-center items-center gap-2">
            Open UPI App <ExternalLink className="w-4 h-4" />
          </a>

          <div className="text-left">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">UPI transaction ID (optional)</label>
            <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Enter after paying" className="w-full mt-1 p-3 text-sm bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none" />
          </div>
          <p className="text-[11px] text-stone-500">After payment, submit your order. We will verify the payment before confirming it.</p>
          <button onClick={() => onPaymentSubmitted(reference.trim())} className="w-full py-3.5 rounded-xl bg-[#FF7A00] hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> I Have Paid — Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}

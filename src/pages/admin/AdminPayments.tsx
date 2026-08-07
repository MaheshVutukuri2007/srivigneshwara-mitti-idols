import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Payment } from '../../types';

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const snap = await getDocs(collection(db, 'payments'));
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">UPI QR Payment Requests</h1>
        <p className="text-xs text-stone-400 mt-1">Check the UPI transfer before marking an order as paid.</p>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-950/50 text-stone-400 font-bold uppercase">
              <th className="py-3 px-4">UPI Transaction ID</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-500">No online transactions logged yet.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{p.paymentReference || 'Not provided'}</td>
                  <td className="py-3 px-4 font-extrabold text-[#FF7A00]">₹{p.amount}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-400">{new Date(p.date).toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

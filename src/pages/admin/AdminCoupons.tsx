import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Coupon } from '../../types';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(500);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await addDoc(collection(db, 'coupons'), {
        code: code.toUpperCase(),
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrderAmount),
        maxDiscountAmount: 500,
        isActive: true,
        expiryDate: '2026-12-31',
      });
      setCode('');
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Promo Discount Coupons</h1>
        <p className="text-xs text-stone-400 mt-1">Create and manage checkout discount codes for Vijayawada customers.</p>
      </div>

      <form onSubmit={handleAddCoupon} className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs">
        <h3 className="font-bold text-stone-200">Create New Coupon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon Code (e.g. GANESH10)"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-mono uppercase"
            required
          />
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            placeholder="Discount Percentage (%)"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-bold"
            required
          />
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(Number(e.target.value))}
            placeholder="Minimum Cart Total (₹)"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-bold"
            required
          />
        </div>
        <button type="submit" className="bg-[#FF7A00] text-white font-bold px-4 py-2 rounded-xl">
          Create Coupon
        </button>
      </form>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-stone-800 font-bold text-stone-300">
          Active Coupons ({coupons.length})
        </div>
        <div className="divide-y divide-stone-800">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-[#FF7A00] text-sm">{c.code}</span>
                <span className="text-stone-400 block text-[10px]">
                  {c.discountPercent}% Off • Min Order ₹{c.minOrderAmount}
                </span>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-rose-400 p-2 hover:bg-stone-800 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

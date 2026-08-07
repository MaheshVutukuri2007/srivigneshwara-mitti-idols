import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Review } from '../../types';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleApproval = async (r: Review) => {
    try {
      await updateDoc(doc(db, 'reviews', r.id), { isApproved: !r.isApproved });
      setReviews((prev) => prev.map((item) => (item.id === r.id ? { ...item, isApproved: !item.isApproved } : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Customer Ratings & Reviews</h1>
        <p className="text-xs text-stone-400 mt-1">Approve, moderate, or remove customer feedback for Ganesh idols.</p>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <div className="divide-y divide-stone-800">
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-stone-500">No reviews submitted yet.</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-100">{r.customerName}</span>
                    <span className="text-[10px] text-stone-500 ml-2">on {r.productName}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>

                <p className="text-stone-300">{r.reviewText}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${r.isApproved ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                    {r.isApproved ? 'Approved & Visible' : 'Pending Approval'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleApproval(r)}
                      className="bg-stone-800 text-stone-200 px-3 py-1 rounded-lg font-bold"
                    >
                      {r.isApproved ? 'Hide' : 'Approve'}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

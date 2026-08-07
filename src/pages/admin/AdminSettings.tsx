import React, { useState } from 'react';
import { CheckCircle2, Database, Save, Trash2 } from 'lucide-react';
import { clearDemoDataFromFirestore } from '../../lib/seedData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useEffect } from 'react';

export default function AdminSettings() {
  const [clearing, setClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('Sri Vigneshwara Mitti Idols');
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiSaved, setUpiSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'store_settings')).then((snapshot) => {
      if (!snapshot.exists()) return;
      const settings = snapshot.data();
      setUpiId(settings.upiId || '');
      setUpiPayeeName(settings.upiPayeeName || 'Sri Vigneshwara Mitti Idols');
    }).catch((err) => console.error('Could not load UPI settings:', err));
  }, []);

  const handleSaveUpi = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingUpi(true);
    setUpiSaved(false);
    try {
      await setDoc(doc(db, 'settings', 'store_settings'), { upiId: upiId.trim(), upiPayeeName: upiPayeeName.trim() || 'Sri Vigneshwara Mitti Idols' }, { merge: true });
      setUpiSaved(true);
    } catch (err) {
      console.error('Could not save UPI settings:', err);
      alert('Could not save UPI settings. Please try again.');
    } finally {
      setSavingUpi(false);
    }
  };

  const handleClearDemoData = async () => {
    if (!window.confirm('Remove all demo products, categories, banners, coupons, and sample reviews from Firestore? Only data uploaded by admin will be displayed.')) return;
    setClearing(true);
    setClearSuccess(false);

    try {
      await clearDemoDataFromFirestore();
      setClearSuccess(true);
      alert('All demo data has been purged. Only admin uploaded items will now be displayed.');
    } catch (err) {
      console.error('Error clearing demo data:', err);
      alert('Failed to clear demo data.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Store Settings & Database Tools</h1>
        <p className="text-xs text-stone-400 mt-1">Configure your UPI QR payment details and manage catalog data.</p>
      </div>

      <form onSubmit={handleSaveUpi} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 text-xs">
        <div>
          <h3 className="font-serif font-bold text-sm text-stone-100">Personal UPI QR Payment</h3>
          <p className="text-stone-400 mt-1">Customers will scan a QR code that sends the exact order total to this UPI ID.</p>
        </div>
        <div>
          <label className="font-bold text-stone-400">Your UPI ID *</label>
          <input type="text" value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="yourname@bank" required className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none" />
        </div>
        <div>
          <label className="font-bold text-stone-400">Account holder / payee name</label>
          <input type="text" value={upiPayeeName} onChange={(event) => setUpiPayeeName(event.target.value)} className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none" />
        </div>
        <button disabled={savingUpi} className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl shadow flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {savingUpi ? 'Saving...' : 'Save UPI Details'}
        </button>
        {upiSaved && <p className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> UPI QR payments are ready.</p>}
      </form>

      {/* Database Management Box */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 text-xs">
        <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FF7A00]" /> Database Management
        </h3>
        <p className="text-stone-400 leading-relaxed">
          Remove sample/demo products, default categories, initial hero banners, and test reviews so that <strong className="text-stone-200">ONLY items uploaded directly by you (the Admin)</strong> are shown on the store.
        </p>

        <button
          onClick={handleClearDemoData}
          disabled={clearing}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-xl shadow flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          <Trash2 className={`w-4 h-4 ${clearing ? 'animate-spin' : ''}`} />
          <span>{clearing ? 'Purging Demo Data...' : 'Clear All Demo Data'}</span>
        </button>

        {clearSuccess && (
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Demo data purged! Only admin uploaded items are now live.
          </p>
        )}
      </div>

      {/* Store Information */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 text-xs">
        <h3 className="font-serif font-bold text-sm text-stone-100">Store Details</h3>
        <div className="space-y-3">
          <div>
            <label className="font-bold text-stone-400">Store Name</label>
            <input
              type="text"
              value="Sri Vigneshwara Mitti Idols"
              disabled
              className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-200 font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-stone-400">Primary Phone Helpline</label>
            <input
              type="text"
              value="9390538027"
              disabled
              className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-[#FF7A00] font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-stone-400">Delivery Coverage City</label>
            <input
              type="text"
              value="Vijayawada, Andhra Pradesh (Free Doorstep Delivery)"
              disabled
              className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-emerald-400 font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

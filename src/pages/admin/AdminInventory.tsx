import React, { useState, useEffect } from 'react';
import { Boxes, Save } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../types';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<{ [id: string]: number }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      setProducts(list);
      const initialMap: { [id: string]: number } = {};
      list.forEach((p) => { initialMap[p.id] = p.stock; });
      setStockMap(initialMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickUpdateStock = async (prodId: string) => {
    setSavingId(prodId);
    try {
      const newStock = stockMap[prodId];
      await updateDoc(doc(db, 'products', prodId), { stock: Number(newStock) });
      setProducts((prev) => prev.map((p) => (p.id === prodId ? { ...p, stock: Number(newStock) } : p)));
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Live Stock Inventory Control</h1>
        <p className="text-xs text-stone-400 mt-1">Quick stock adjustments during peak Ganesh festival booking rush.</p>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <div className="divide-y divide-stone-800">
          {products.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-stone-800" />
                <div>
                  <p className="font-bold text-stone-100">{p.name}</p>
                  <span className="text-[10px] text-stone-500 font-mono">SKU: {p.sku} • ₹{p.price}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stockMap[p.id] ?? p.stock}
                  onChange={(e) => setStockMap({ ...stockMap, [p.id]: Number(e.target.value) })}
                  className="w-20 p-2 bg-stone-800 rounded-lg border border-stone-700 text-center font-bold text-stone-100 outline-none"
                />
                <button
                  onClick={() => handleQuickUpdateStock(p.id)}
                  disabled={savingId === p.id}
                  className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold p-2 rounded-lg flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

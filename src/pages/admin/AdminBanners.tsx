import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Banner } from '../../types';

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Order Eco Clay Idol');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const snap = await getDocs(collection(db, 'banners'));
      setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    try {
      await addDoc(collection(db, 'banners'), {
        title,
        subtitle,
        imageUrl,
        buttonText,
        buttonLink: '/products',
        active: true,
      });
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Hero Carousel Banners</h1>
        <p className="text-xs text-stone-400 mt-1">Manage promotional sliders displayed on the main storefront homepage.</p>
      </div>

      <form onSubmit={handleAddBanner} className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 text-xs">
        <h3 className="font-bold text-stone-200">Add New Banner</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Main Title Heading"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100"
            required
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle Description"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100"
          />
        </div>

        {/* Image File Selector */}
        <div className="space-y-2">
          <label className="font-bold text-stone-300 block">Banner Photo (Upload File)</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 border-2 border-dashed border-stone-700 bg-stone-800/60 rounded-xl p-3 text-center hover:border-[#FF7A00] transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div className="flex items-center justify-center space-x-2 text-stone-300 group-hover:text-[#FF7A00]">
                <Upload className="w-4 h-4" />
                <span className="font-bold">Choose Banner Photo File</span>
              </div>
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste Image URL..."
              className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-mono flex-1 text-[11px]"
              required
            />
          </div>
          {imageUrl && (
            <div className="w-full h-24 rounded-xl border border-stone-700 overflow-hidden bg-stone-800">
              <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button type="submit" className="bg-[#FF7A00] text-white font-bold px-5 py-2.5 rounded-xl shadow">
          Publish Banner
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden relative group">
            <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-1">
              <h4 className="font-serif font-bold text-sm text-stone-100">{b.title}</h4>
              <p className="text-xs text-stone-400">{b.subtitle}</p>
            </div>
            <button
              onClick={() => handleDelete(b.id)}
              className="absolute top-2 right-2 bg-stone-950/80 text-rose-400 hover:text-white p-2 rounded-full shadow"
              title="Delete Banner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

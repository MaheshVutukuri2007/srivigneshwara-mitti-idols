import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Category } from '../../types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'categories'));
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addDoc(collection(db, 'categories'), {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image: image || 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800',
        isActive: true,
      });
      setName('');
      setSlug('');
      setImage('');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Product Categories</h1>
        <p className="text-xs text-stone-400 mt-1">Organize Ganesh idols by size, craft technique, or plantation type.</p>
      </div>

      <form onSubmit={handleAddCategory} className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 text-xs">
        <h3 className="font-bold text-stone-200">Create New Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name (e.g. Seed Ganesh)"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100"
            required
          />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="URL Slug (e.g. seed-ganesh)"
            className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-mono"
          />
        </div>

        {/* Category Photo Upload */}
        <div className="space-y-2">
          <label className="font-bold text-stone-300 block">Category Image (Upload File)</label>
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
                <span className="font-bold">Choose Category Photo File</span>
              </div>
            </div>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste Image URL..."
              className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 outline-none text-stone-100 font-mono flex-1 text-[11px]"
            />
          </div>
          {image && (
            <div className="w-20 h-20 rounded-xl border border-stone-700 overflow-hidden bg-stone-800">
              <img src={image} alt="Category Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button type="submit" className="bg-[#FF7A00] text-white font-bold px-5 py-2.5 rounded-xl shadow">
          Add Category
        </button>
      </form>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-stone-800 font-bold text-stone-300">
          Existing Categories ({categories.length})
        </div>
        <div className="divide-y divide-stone-800">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg bg-stone-800" />
                <div>
                  <p className="font-bold text-stone-100">{cat.name}</p>
                  <span className="text-[10px] text-stone-400 font-mono">/{cat.slug}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-rose-400 p-2 hover:bg-stone-800 rounded-lg" title="Delete Category">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

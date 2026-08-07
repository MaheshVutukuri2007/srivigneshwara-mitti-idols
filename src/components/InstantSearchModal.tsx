import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

interface InstantSearchModalProps {
  onClose: () => void;
}

export default function InstantSearchModal({ onClose }: InstantSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(list);
      } catch (err) {
        console.error('Error fetching search products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.material.toLowerCase().includes(term) ||
        p.colour.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    );
    setFiltered(matches.slice(0, 6));
  }, [searchTerm, products]);

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-amber-500/20 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-6 h-6 text-[#FF7A00]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search eco clay idols, height, material, seed idols..."
            className="flex-1 text-base bg-transparent border-none outline-none text-stone-900 dark:text-white placeholder-stone-400"
            autoFocus
          />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950/50 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-stone-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" /> Popular:
          </span>
          {['Seed Idols', 'River Clay', '12 Inch', '18 Inch', 'Turmeric Paint', 'Dagdusheth'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#FF7A00] border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-full text-[11px] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-stone-500">Loading idols catalog...</div>
          ) : searchTerm.trim() && filtered.length === 0 ? (
            <div className="py-8 text-center text-stone-500">
              <p className="font-semibold text-stone-800 dark:text-stone-200">No matching Ganesh idols found</p>
              <p className="text-xs mt-1">Try searching by size like "12 Inch" or "Pure Clay"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-800 cursor-pointer transition-colors border border-transparent hover:border-amber-200 dark:hover:border-stone-700"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-2">
                      <span>{product.heightInInches} Inch</span> • <span>{product.material}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#FF7A00]">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[11px] text-stone-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#FF7A00]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

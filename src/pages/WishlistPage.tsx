import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlistIds } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
        setWishlistProducts(all.filter((p) => wishlistIds.includes(p.id)));
      } catch (err) {
        console.error('Error fetching wishlist products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [wishlistIds]);

  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-stone-500">Save your favorite eco clay Ganesh idols here while browsing.</p>
          <Link to="/products" className="bg-[#FF7A00] text-white font-bold text-xs px-6 py-3 rounded-xl shadow inline-block">
            Browse Ganesh Idols
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100">
          Saved Ganesh Idols ({wishlistProducts.length})
        </h1>

        {loading ? (
          <div className="text-center py-12 text-xs text-stone-500">Loading saved items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

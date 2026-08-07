import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ExploreIdolsDashboard from '../components/ExploreIdolsDashboard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilterParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilterParam);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedHeight, setSelectedHeight] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setSelectedCategory(categoryFilterParam);
  }, [categoryFilterParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        const catSnap = await getDocs(collection(db, 'categories'));

        setProducts(prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product)));
        setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = p.name.toLowerCase().includes(term);
          const matchCategory = p.categoryName?.toLowerCase().includes(term);
          const matchMaterial = p.material.toLowerCase().includes(term);
          if (!matchName && !matchCategory && !matchMaterial) return false;
        }

        // Category filter
        if (selectedCategory && p.categoryId !== selectedCategory) {
          return false;
        }

        // Price Range
        if (p.price > priceRange) {
          return false;
        }

        // Height filter
        if (selectedHeight !== 'all') {
          const h = p.heightInInches;
          if (selectedHeight === 'under12' && h >= 12) return false;
          if (selectedHeight === '12to18' && (h < 12 || h > 18)) return false;
          if (selectedHeight === 'above18' && h <= 18) return false;
        }

        // In Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // Default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, priceRange, selectedHeight, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange(5000);
    setSelectedHeight('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Explore Idols Top Dashboard */}
        <ExploreIdolsDashboard
          productsCount={filteredProducts.length}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          selectedHeight={selectedHeight}
          onSelectHeight={(h) => setSelectedHeight(h)}
        />

        {/* Header Title */}
        <div className="mb-8 border-b border-amber-900/10 dark:border-stone-800 pb-6">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Eco Clay Catalog
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 mt-1">
            Handcrafted Eco-Friendly Ganesh Idols
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse pure Ganga water clay idols with free doorstep delivery across Vijayawada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 hover:text-[#FF7A00] flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Idol name, material, height..."
                  className="w-full text-xs p-2.5 pl-8 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none focus:border-[#FF7A00]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Category</label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="accent-[#FF7A00]"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="accent-[#FF7A00]"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>Max Price:</span>
                <span className="text-[#FF7A00]">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="80"
                max="5000"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#FF7A00] cursor-pointer"
              />
            </div>

            {/* Height Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Idol Height</label>
              <select
                value={selectedHeight}
                onChange={(e) => setSelectedHeight(e.target.value)}
                className="w-full text-xs p-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
              >
                <option value="all">All Heights</option>
                <option value="under12">Compact (Under 12 Inches)</option>
                <option value="12to18">Medium (12 to 18 Inches)</option>
                <option value="above18">Grand Idol (Above 18 Inches)</option>
              </select>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#FF7A00] w-4 h-4 rounded"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Main Products Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-4 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
              <span className="text-stone-500">
                Showing <strong className="text-stone-900 dark:text-stone-100">{filteredProducts.length}</strong> Eco Ganesh Idols
              </span>

              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-bold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stone-100 dark:bg-stone-800 p-2 rounded-xl border border-stone-200 dark:border-stone-700 outline-none font-semibold text-stone-800 dark:text-stone-200"
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#FFFDF7] dark:bg-stone-900 p-12 rounded-2xl text-center border border-amber-900/10 dark:border-stone-800 space-y-3">
                <p className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">No Products Available</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  The store catalog is currently empty. Upload Ganesh Idols in the Admin Dashboard to list items.
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#FFFDF7] dark:bg-stone-900 p-12 rounded-2xl text-center border border-amber-900/10 dark:border-stone-800 space-y-3">
                <p className="font-serif font-bold text-lg">No Ganesh Idols Match Your Filters</p>
                <p className="text-xs text-stone-500">Try adjusting your height, price slider or category selection.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#FF7A00] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

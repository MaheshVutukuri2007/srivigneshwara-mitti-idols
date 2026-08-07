import React from 'react';
import { Sparkles, Layers, ShieldCheck, Truck, Droplets, Ruler, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';

interface ExploreIdolsDashboardProps {
  productsCount: number;
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  selectedHeight?: string;
  onSelectHeight?: (height: string) => void;
  onSearchClick?: () => void;
}

export default function ExploreIdolsDashboard({
  productsCount,
  categories,
  selectedCategory = '',
  onSelectCategory,
  selectedHeight = 'all',
  onSelectHeight,
  onSearchClick,
}: ExploreIdolsDashboardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 mb-8 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-[#FFD54F]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FFD54F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Interactive Catalog Portal</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
            Explore Idols Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Live catalog dashboard for 100% Eco-Friendly Ganga Water Clay Ganesh Idols with Vijayawada doorstep delivery.
          </p>
        </div>

        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className="self-start md:self-auto bg-[#FF7A00] hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Instant Search Idols</span>
          </button>
        )}
      </div>

      {/* Live Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
        <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold">Total Catalog</span>
            <Layers className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-[#FFD54F]">
            {productsCount} <span className="text-xs font-sans text-stone-300 font-normal">Idols</span>
          </div>
          <p className="text-[10px] text-stone-400">Directly from Vijayawada Artisans</p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold">Clay Quality</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-white">
            100% <span className="text-xs font-sans text-stone-300 font-normal">Ganga Clay</span>
          </div>
          <p className="text-[10px] text-stone-400">Zero Chemical Additives</p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold">Visarjan Time</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-white">
            30 Mins <span className="text-xs font-sans text-stone-300 font-normal">In Bucket</span>
          </div>
          <p className="text-[10px] text-stone-400">100% Eco Water Dissolvable</p>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold">Vijayawada Shipping</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-extrabold text-white">
            FREE <span className="text-xs font-sans text-stone-300 font-normal">Doorstep</span>
          </div>
          <p className="text-[10px] text-stone-400">Express Local Delivery</p>
        </div>
      </div>

      {/* Quick Category & Size Navigation Shortcuts */}
      <div className="relative z-10 pt-4 border-t border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-300">
          <span className="font-bold flex items-center gap-1.5 text-[#FFD54F]">
            <Ruler className="w-3.5 h-3.5" /> Quick Filter By Height & Collection:
          </span>
          <Link to="/products" className="text-[#FF7A00] font-bold hover:underline flex items-center gap-1">
            Full Catalog <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Height Filter Shortcuts */}
          {onSelectHeight && (
            <>
              <button
                onClick={() => onSelectHeight('all')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedHeight === 'all'
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                All Heights
              </button>
              <button
                onClick={() => onSelectHeight('under12')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedHeight === 'under12'
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                🌱 Under 12" (Home Puja)
              </button>
              <button
                onClick={() => onSelectHeight('12to18')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedHeight === '12to18'
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                🪔 12" to 18" (Popular)
              </button>
              <button
                onClick={() => onSelectHeight('above18')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedHeight === 'above18'
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                👑 Above 18" (Grand Lalbaug)
              </button>
            </>
          )}

          {/* Category Shortcuts */}
          {onSelectCategory &&
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === selectedCategory ? '' : cat.id)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFD54F] text-stone-950 shadow-md'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-[#FFFDF7] dark:bg-stone-900 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            {product.discount}% OFF
          </span>
        )}
        {product.featured && (
          <span className="bg-amber-500 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Wishlist toggle"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'
          }`}
        />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1600100397608-f010e423b971'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover Second Image Overlay */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Height & Material tags */}
          <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <span className="bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
              📏 {product.heightInInches} Inch
            </span>
            <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded truncate max-w-[120px]">
              🌿 {product.material}
            </span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base leading-snug hover:text-[#FF7A00] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-900/5 dark:border-stone-800">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating || '4.9'}</span>
            <span className="text-stone-400 font-normal">({product.reviewCount || 12})</span>
          </div>

          {/* Stock Badge */}
          {isOutOfStock ? (
            <span className="text-rose-600 font-bold text-[10px] flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
              <ShieldAlert className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-amber-600 font-bold text-[10px] flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded animate-pulse">
              Only {product.stock} Left!
            </span>
          ) : (
            <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              <CheckCircle className="w-3 h-3" /> In Stock
            </span>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-[#FF7A00]">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Free Delivery Vijayawada
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-[#FF7A00] hover:bg-amber-600 text-white shadow hover:scale-105'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

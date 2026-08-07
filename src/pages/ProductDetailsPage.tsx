import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Share2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Maximize2,
  X,
  Droplet,
  MessageCircle,
} from 'lucide-react';
import { doc, getDoc, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user, customerProfile } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Product;
          setProduct(data);
          setSelectedImage(data.images[0] || '');

          // Fetch Related Products
          const allSnap = await getDocs(collection(db, 'products'));
          const all = allSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
          setRelatedProducts(all.filter((p) => p.id !== id).slice(0, 3));

          // Fetch Reviews for Product
          const qRev = query(collection(db, 'reviews'), where('productId', '==', id));
          const revSnap = await getDocs(qRev);
          setReviews(revSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-12 text-center text-stone-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-12 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Ganesh Idol Not Found</h2>
        <Link to="/products" className="bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-xs font-bold inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Sri Vigneshwara Mitti Idols!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Namaste! I am interested in ${product.name} (Price: ₹${product.price}). Link: ${window.location.href}`
    );
    window.open(`https://wa.me/919390538027?text=${text}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);

    try {
      const newReview: Omit<Review, 'id'> = {
        productId: product.id,
        productName: product.name,
        customerId: user?.uid || 'guest_user',
        customerName: customerProfile?.name || 'Devotee',
        rating,
        reviewText,
        isApproved: true,
        createdAt: new Date().toLocaleDateString('en-IN'),
      };

      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      setReviews((prev) => [{ id: docRef.id, ...newReview }, ...prev]);
      setReviewText('');
      setReviewSuccessMsg('Thank you for your review!');
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="text-xs text-stone-500 flex items-center space-x-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:underline">Catalog</Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-stone-200 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-sm">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 dark:border-stone-800">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setFullscreenImage(true)}
                className="absolute top-3 right-3 bg-stone-900/70 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-md"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === imgUrl ? 'border-[#FF7A00] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400">SKU: {product.sku}</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-[#FF7A00] font-bold px-2.5 py-1 rounded-full">
                  {product.categoryName || 'Eco Clay Idol'}
                </span>
              </div>
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-2 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Price & Discounts */}
            <div className="p-4 bg-amber-50/50 dark:bg-stone-800/50 rounded-2xl border border-amber-200/50 dark:border-stone-700 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#FF7A00]">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> FREE Doorstep Delivery Across Vijayawada
                </p>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold text-xs bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Specifications Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Height</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.heightInInches} Inches</span>
              </div>
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Material</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.material}</span>
              </div>
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Dissolves In</span>
                <span className="font-bold text-emerald-600">30 Mins Water</span>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Quantity:</span>
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-base font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-base font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3.5 px-6 rounded-xl shadow flex items-center justify-center gap-2 text-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#FF7A00] hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 ${
                    isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Share & Inquiry Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 text-xs">
              <button onClick={handleShare} className="text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1 hover:text-[#FF7A00]">
                <Share2 className="w-4 h-4" /> Share Idol
              </button>
              <button onClick={handleWhatsAppShare} className="text-emerald-600 font-bold flex items-center gap-1 hover:underline">
                <MessageCircle className="w-4 h-4" /> Ask Question on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Description & Specifications Tabs */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-3">
            Product Specifications & Description
          </h3>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <span className="text-stone-500 font-bold">Material:</span>
              <span className="font-semibold">{product.material}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <span className="text-stone-500 font-bold">Colour & Finish:</span>
              <span className="font-semibold">{product.colour}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <span className="text-stone-500 font-bold">Height x Width:</span>
              <span className="font-semibold">{product.heightInInches}" x {product.widthInInches || 8}"</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <span className="text-stone-500 font-bold">Weight:</span>
              <span className="font-semibold">{product.weightInKg || 3} kg</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            Devotee Ratings & Reviews
          </h3>

          {/* Form */}
          <form onSubmit={handleReviewSubmit} className="bg-amber-50/50 dark:bg-stone-800/50 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-stone-700 dark:text-stone-300">Write a Review for {product.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-lg ${star <= rating ? 'text-amber-400' : 'text-stone-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this eco clay idol..."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 outline-none"
              required
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-[#FF7A00] text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
            >
              Submit Review
            </button>
            {reviewSuccessMsg && <p className="text-xs text-emerald-600 font-bold">{reviewSuccessMsg}</p>}
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{rev.customerName}</span>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 dark:text-stone-300">{rev.reviewText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenImage(false)}
            className="absolute top-4 right-4 text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded-2xl" />
        </div>
      )}
    </div>
  );
}

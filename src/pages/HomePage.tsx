import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Droplet,
  Sprout,
  HeartHandshake,
  Star,
  ChevronRight,
  HelpCircle,
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category, Banner, Review } from '../types';
import HeroBannerSlider from '../components/HeroBannerSlider';
import ProductCard from '../components/ProductCard';
import VisarjanGuideModal from '../components/VisarjanGuideModal';
import ExploreIdolsDashboard from '../components/ExploreIdolsDashboard';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visarjanModalOpen, setVisarjanModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bannersSnap, prodSnap, catSnap, revSnap] = await Promise.all([
          getDocs(collection(db, 'banners')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'reviews')),
        ]);

        if (!bannersSnap.empty) {
          setBanners(bannersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Banner)));
        } else {
          setBanners([]);
        }

        const allProds = prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(allProds.slice(0, 6));

        setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category)));

        if (!revSnap.empty) {
          setReviews(revSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review)));
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const faqs = [
    {
      q: 'Why choose Sri Vigneshwara Eco-Friendly Mitti Idols?',
      a: 'Our idols are handcrafted by experienced artisans using 100% natural, unbaked river clay. They dissolve completely in water without leaving toxic sludge or chemical pollution.',
    },
    {
      q: 'How does doorstep delivery work across Vijayawada?',
      a: 'We offer FREE doorstep delivery in Vijayawada city (Governorpet, Patamata, One Town, Benz Circle, Gunadala, Tadepalli, etc.). Every idol is packed in shockproof eco-packaging.',
    },
    {
      q: 'How do I perform home Visarjan in a bucket or pot?',
      a: 'Fill a clean bucket or water container with fresh water. Gently submerge Lord Ganesha. The idol will dissolve into sacred mud within 30 minutes. You can pour the nutrient water into your potted plants.',
    },
    {
      q: 'Are the colors used on painted idols safe for plants?',
      a: 'Yes! We strictly use organic turmeric paste, kumkum, geru (red ochre), and non-toxic mineral powders. They are 100% safe for home plants and garden soil.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 space-y-16 pb-16">
      {/* 1. Hero Banner Slider */}
      <HeroBannerSlider banners={banners} />

      {/* 2. Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF7] dark:bg-stone-900 rounded-2xl p-6 border border-amber-900/10 dark:border-stone-800 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">100% Water Dissolvable</h4>
              <p className="text-xs text-stone-500">Dissolves in 30 mins at home</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">Free Vijayawada Delivery</h4>
              <p className="text-xs text-stone-500">Safe doorstep express service</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">Plantable Seed Idols</h4>
              <p className="text-xs text-stone-500">Grows into Tulsi & Marigold</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#FF7A00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">Zero Chemical Dyes</h4>
              <p className="text-xs text-stone-500">Pure turmeric & organic kumkum</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Featured Ganesh Idols */}
      <section id="explore-idols" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Explore Idols Top Dashboard */}
        <ExploreIdolsDashboard
          productsCount={featuredProducts.length}
          categories={categories}
        />

        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Spiritual Collection
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-1">
              {t('featuredIdols')}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1"
          >
            View All Idols <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-[#FFFDF7] dark:bg-stone-900 border border-amber-900/10 dark:border-stone-800 rounded-2xl p-10 text-center space-y-3">
            <p className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">No Products Available</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Ganesh Idols will appear here once uploaded by the administrator through the Admin Dashboard.
            </p>
            <Link
              to="/admin/products"
              className="inline-block bg-[#FF7A00] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow mt-2"
            >
              Upload Products in Admin Panel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Categories Grid */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">
            Eco Categories
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-1">
            Browse By Idol Collection
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="bg-[#FFFDF7] dark:bg-stone-900 border border-amber-900/10 dark:border-stone-800 rounded-2xl p-8 text-center text-xs text-stone-500">
            No Categories Available. Add category collections in the Admin Dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group relative rounded-2xl overflow-hidden shadow-md h-64 border border-amber-900/10 dark:border-stone-800 bg-stone-900"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500 text-xs font-bold">
                    {cat.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-[#FFD54F] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="text-[11px] font-bold text-[#FF7A00] inline-flex items-center gap-1 pt-1">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. Our Process & Visarjan Guide Banner */}
      <section className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="bg-[#FF7A00]/20 text-[#FFD54F] border border-[#FF7A00]/40 px-3 py-1 rounded-full text-xs font-semibold">
                🌿 Sacred & Sustainable
              </span>
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl leading-tight">
                Celebrate Without Polluting Sacred Rivers
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Traditional POP (Plaster of Paris) idols ruin our rivers and harm aquatic life for years. Sri Vigneshwara Mitti Idols are handcrafted using 100% natural Ganga water clay. When immersed in water, they return softly to mother earth within 30 minutes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Zero Toxic Plaster of Paris</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Enriches Garden Soil & Plants</span>
                </div>
              </div>

              <button
                onClick={() => setVisarjanModalOpen(true)}
                className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Read Home Visarjan Step-By-Step Guide
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 bg-stone-900 p-8 text-center space-y-3">
              <span className="text-xs font-bold text-[#FFD54F] uppercase tracking-wider">Eco Immersion</span>
              <h3 className="font-serif font-bold text-xl text-white">Pure Ganga Water Clay</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Perform Visarjan directly at home in a bucket or garden pot. Watch Lord Ganesha return naturally to Mother Earth without harming water bodies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">
            Devotee Feedback
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-1">
            Loved By Families Across Vijayawada
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-[#FFFDF7] dark:bg-stone-900 border border-amber-900/10 dark:border-stone-800 rounded-2xl p-8 text-center text-xs text-stone-500">
            No Devotee Reviews Available Yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.createdAt}</span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                  "{rev.reviewText}"
                </p>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{rev.customerName}</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">
            Questions & Help
          </span>
          <h2 className="font-serif font-extrabold text-2xl text-stone-900 dark:text-stone-100 mt-1">
            {t('faqTitle')}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF7] dark:bg-stone-900 rounded-xl border border-amber-900/10 dark:border-stone-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 font-serif font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <span className="text-[#FF7A00] text-lg font-bold">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Visarjan Guide Modal */}
      {visarjanModalOpen && <VisarjanGuideModal onClose={() => setVisarjanModalOpen(false)} />}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { Banner } from '../types';

interface HeroBannerSliderProps {
  banners: Banner[];
}

export default function HeroBannerSlider({ banners }: HeroBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full bg-stone-900 text-white py-16 px-4 text-center border-b border-stone-800">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FFD54F] px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <span>Sri Vigneshwara Mitti Idols • Storefront</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white">
            Welcome to Sri Vigneshwara Mitti Idols
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            100% Eco-Friendly Pure Ganga Water Clay Ganesh Idols with Free Doorstep Delivery across Vijayawada.
          </p>
          <div className="pt-2">
            <p className="text-xs text-amber-400 font-semibold bg-stone-800/80 inline-block px-4 py-2 rounded-xl border border-stone-700">
              No custom promotional banners published yet. Upload hero banners in Admin Dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-stone-900 text-white min-h-[480px] lg:min-h-[560px] flex items-center">
      {/* Background Image with Overlay Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover opacity-30 scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
      </div>

      {/* Main Banner Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left duration-500">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FFD54F] px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <span>Sri Vigneshwara Mitti Idols • Vijayawada</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white drop-shadow">
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
            {current.subtitle}
          </p>

          {/* Special Delivery Highlights */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 pt-2 text-xs font-medium text-amber-200">
            <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
              <Truck className="w-4 h-4 text-[#FF7A00]" /> Free Doorstep Delivery
            </div>
            <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
              <ShieldCheck className="w-4 h-4 text-[#FFD54F]" /> 100% Water Dissolvable
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to={current.linkUrl || '/products'}
              className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all hover:scale-105"
            >
              Order Ganesh Idols Online
            </Link>
            <Link
              to="/about"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all"
            >
              Our Eco Clay Story
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-[#FF7A00]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

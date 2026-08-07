import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center text-white text-xl font-bold font-serif">
                🪔
              </div>
              <span className="font-serif font-bold text-lg text-white">
                Sri Vigneshwara Mitti Idols
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Crafting 100% natural Ganga river clay Ganesh idols. Dedicated to zero water pollution, eco-friendly celebrations, and free doorstep delivery across Vijayawada.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-stone-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FF7A00] transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#FF7A00] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#FF7A00] transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#FF7A00] transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#FFD54F]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-[#FF7A00] transition-colors">All Ganesh Idols</Link></li>
              <li><Link to="/products?category=cat_seed_idols" className="hover:text-[#FF7A00] transition-colors">Plantable Seed Idols</Link></li>
              <li><Link to="/products?category=cat_pure_clay" className="hover:text-[#FF7A00] transition-colors">Pure River Clay Idols</Link></li>
              <li><Link to="/track-order" className="hover:text-[#FF7A00] transition-colors">Track My Delivery Order</Link></li>
              <li><Link to="/about" className="hover:text-[#FF7A00] transition-colors">About Our Craftsmanship</Link></li>
            </ul>
          </div>

          {/* Customer & Policy */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#FFD54F]">
              Policies & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/policy/terms" className="hover:text-[#FF7A00] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/policy/privacy" className="hover:text-[#FF7A00] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policy/refund" className="hover:text-[#FF7A00] transition-colors">Transit Damage Refund Policy</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-[#FF7A00] transition-colors">Vijayawada Free Shipping Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF7A00] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Store Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#FFD54F]">
              Vijayawada Store & Helpline
            </h4>
            <div className="flex items-start space-x-2 text-stone-300">
              <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
              <span>D.No. 73-1-5, MG Road, Patamata, Opp. High School Road Bus Stop, Vijayawada - 520010</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-300">
              <Phone className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <a href="tel:9390538027" className="hover:underline font-bold text-[#FFD54F]">9390538027</a>
            </div>
            <div className="flex items-center space-x-2 text-stone-300">
              <Clock className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <span>Mon - Sun: 8:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Sri Vigneshwara Mitti Idols. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> for Vijayawada
          </p>
        </div>
      </div>
    </footer>
  );
}

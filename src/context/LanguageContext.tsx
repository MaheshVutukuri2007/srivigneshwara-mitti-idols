import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
  };
}

const dictionary: Translations = {
  // Navigation & Branding
  brandName: { en: 'Sri Vigneshwara Mitti Idols', te: 'శ్రీ విఘ్నేశ్వర మట్టి ప్రతిమలు' },
  home: { en: 'Home', te: 'హోమ్' },
  products: { en: 'Products', te: 'ప్రతిమలు' },
  categories: { en: 'Categories', te: 'విభాగాలు' },
  offers: { en: 'Offers', te: 'ఆఫర్లు' },
  reviews: { en: 'Reviews', te: 'సమీక్షలు' },
  about: { en: 'About Us', te: 'మా గురించి' },
  contact: { en: 'Contact', te: 'సందర్శించండి' },
  trackOrder: { en: 'Track Order', te: 'ఆర్డర్ ట్రాక్' },
  wishlist: { en: 'Wishlist', te: 'కోరికల జాబితా' },
  cart: { en: 'Cart', te: 'కార్ట్' },
  login: { en: 'Login / Register', te: 'లాగిన్ / రిజిస్టర్' },
  profile: { en: 'My Account', te: 'నా ప్రొఫైల్' },
  adminDashboard: { en: 'Admin Panel', te: 'అడ్మిన్ ప్యానెల్' },

  // Hero & Subtitles
  heroBadge: { en: '100% Eco-Friendly River Clay Idols', te: '100% పర్యావరణ అనుకూల సహజ మట్టి విగ్రహాలు' },
  deliveryBanner: { en: 'Free Doorstep Delivery Across Vijayawada', te: 'విజయవాడ నగరమంతటా ఉచిత హోమ్ డెలివరీ' },
  shopNow: { en: 'Shop Clay Idols', te: 'విగ్రహాలు కొనుగోలు చేయండి' },
  viewCategories: { en: 'Explore Categories', te: 'విభాగాలు చూడండి' },

  // Badges & Stock
  inStock: { en: 'In Stock', te: 'అందుబాటులో ఉంది' },
  onlyLeft: { en: 'Only {x} Left', te: 'కేవలం {x} మాత్రమే మిగిలాయి' },
  outOfStock: { en: 'Out of Stock', te: 'స్టాక్ ముగిసింది' },
  freeDeliveryBadge: { en: 'FREE VIJAYAWADA DELIVERY', te: 'విజయవాడలో ఉచిత డెలివరీ' },
  heightLabel: { en: 'Height:', te: 'ఎత్తు:' },
  weightLabel: { en: 'Weight:', te: 'బరువు:' },
  materialLabel: { en: 'Material:', te: 'తయారీ పదార్థం:' },

  // Product Actions
  addToCart: { en: 'Add to Cart', te: 'కార్ట్‌కు జోడించండి' },
  buyNow: { en: 'Buy Now', te: 'ఇప్పుడే కొనండి' },
  addedToCart: { en: 'Item added to cart!', te: 'వస్తువు కార్ట్‌లో చేర్చబడింది!' },
  quickView: { en: 'Quick View', te: 'త్వరిత వీక్షణం' },

  // Homepage Sections
  featuredIdols: { en: 'Featured Ganesh Idols', te: 'ప్రముఖ విఘ్నేశ్వర ప్రతిమలు' },
  latestIdols: { en: 'Latest Arrivals', te: 'కొత్తగా వచ్చినవి' },
  trendingIdols: { en: 'Trending This Season', te: 'ఈ సీజన్ హాట్ సెలెక్షన్' },
  whyChooseUs: { en: 'Why Choose Sri Vigneshwara Clay Idols?', te: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి?' },
  ourProcess: { en: 'Our Eco-Crafting Process', te: 'మా తయారీ విధానం' },
  visarjanGuide: { en: 'Eco Visarjan at Home Guide', te: 'ఇంటి వద్దే నిమజ్జనం గైడ్' },
  customerTestimonials: { en: 'Customer Reviews & Ratings', te: 'వినియోగదారుల సమీక్షలు' },
  faqTitle: { en: 'Frequently Asked Questions', te: 'తరచుగా అడిగే ప్రశ్నలు' },

  // Footer & Contact
  storeLocation: { en: 'Vijayawada, Andhra Pradesh', te: 'విజయవాడ, ఆంధ్రప్రదేశ్' },
  phone: { en: 'Call Us:', te: 'ఫోన్:' },
  whatsapp: { en: 'WhatsApp Order Help:', te: 'వాట్సాప్ సహాయం:' },
  allRightsReserved: { en: 'All Rights Reserved.', te: 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const entry = dictionary[key];
    let val = entry ? entry[language] || entry.en : key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        val = val.replace(`{${paramKey}}`, String(paramVal));
      });
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

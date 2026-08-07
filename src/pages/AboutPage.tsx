import React from 'react';
import { Droplet, Heart, ShieldCheck, Sprout, Award, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">Our Heritage & Craftsmanship</span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl">Sri Vigneshwara Mitti Idols</h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto">
            Preserving Vijayawada's sacred traditions through 100% eco-friendly, river clay handcrafted Ganesh idols.
          </p>
        </div>

        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-6 leading-relaxed text-xs sm:text-sm text-stone-700 dark:text-stone-300">
          <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            Our Mission for a Clean Vijayawada
          </h2>
          <p>
            For decades, Ganesh Chaturthi celebrations relied on Plaster of Paris (POP) idols and chemical paints that severely polluted the holy Krishna river and surrounding lakes in Vijayawada.
          </p>
          <p>
            Sri Vigneshwara Mitti Idols was established to bring back pure Vedic craftsmanship. Our master sculptors harvest unbaked clay from sacred Ganga river water clay, shaping each idol by hand without any synthetic glues or hazardous chemical paints.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold">
            <div className="p-4 bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-200">
              <Droplet className="w-6 h-6 text-[#FF7A00] mb-2" />
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">100% Water Dissolvable</h4>
              <p className="text-stone-500 font-normal mt-1">Dissolves softly in a bucket at home within 30 minutes.</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-200">
              <Sprout className="w-6 h-6 text-[#FF7A00] mb-2" />
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">Plantable Seed Idols</h4>
              <p className="text-stone-500 font-normal mt-1">Embedded with organic Tulsi and Marigold seeds for home balcony pots.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

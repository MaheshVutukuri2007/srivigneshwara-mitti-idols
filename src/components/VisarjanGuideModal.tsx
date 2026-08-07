import React from 'react';
import { X, Droplet, Sprout, HeartHandshake, Sparkles, Check } from 'lucide-react';

interface VisarjanGuideModalProps {
  onClose: () => void;
}

export default function VisarjanGuideModal({ onClose }: VisarjanGuideModalProps) {
  const steps = [
    {
      title: 'Step 1: Prepare Clean Water Vessel',
      description: 'Fill a large bucket, water drum, or garden planter with fresh water at home. Place a clean cloth at the bottom.',
      icon: Droplet,
    },
    {
      title: 'Step 2: Perform Aarti & Home Visarjan',
      description: 'Gently submerge Sri Vigneshwara Mitti Idol in the vessel. Offer flowers and chant "Ganapati Bappa Morya".',
      icon: HeartHandshake,
    },
    {
      title: 'Step 3: Dissolves in 30 Minutes',
      description: 'Our 100% Ganga water clay dissolves naturally into pure sacred mud. Zero toxic chemical sludge, zero lake pollution.',
      icon: Sparkles,
    },
    {
      title: 'Step 4: Grow Organic Plants or Seed Idol',
      description: 'Pour the nutrient-rich mud water into your balcony pots or garden. If you bought our Seed Idol, Tulsi and Marigold will sprout into lush new plants!',
      icon: Sprout,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF7A00] to-amber-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFD54F] flex items-center gap-1 mb-1">
            🌿 Eco-Friendly Home Guide
          </span>
          <h3 className="font-serif font-bold text-2xl">How to Perform Home Visarjan</h3>
          <p className="text-xs text-amber-100 mt-1">
            Keep Vijayawada's Krishna river clean & bless your home garden with divine mud.
          </p>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-3.5 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-200/40 dark:border-stone-700">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center shrink-0 shadow">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Guaranteed 100% Non-Toxic:</strong> All pigments used are organic turmeric, kumkum, and natural food-grade ochre pigments safe for family plants and soil.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 text-right border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

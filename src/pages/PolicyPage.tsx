import React from 'react';
import { useParams } from 'react-router-dom';

export default function PolicyPage() {
  const { type } = useParams<{ type: string }>();

  const getTitle = () => {
    switch (type) {
      case 'privacy':
        return 'Privacy Policy';
      case 'refund':
        return 'Transit Damage & Refund Policy';
      case 'shipping':
        return 'Free Vijayawada Doorstep Shipping Policy';
      default:
        return 'Terms & Conditions';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-4">
          {getTitle()}
        </h1>

        <div className="bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          <p>
            At <strong>Sri Vigneshwara Mitti Idols</strong>, customer trust and the sanctity of Lord Ganesha idols are our highest priorities.
          </p>

          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">1. Free Doorstep Delivery Across Vijayawada</h3>
          <p>
            We offer 100% free doorstep express delivery within Vijayawada city boundaries. Orders are delivered in shockproof eco-friendly packaging to guarantee zero breakage.
          </p>

          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">2. Transit Damage Protection Guarantee</h3>
          <p>
            In the rare event that an idol suffers any physical damage during doorstep transport, please send a photo to our official WhatsApp Helpline (<strong>9390538027</strong>) within 2 hours of receiving delivery. We will immediately send a fresh replacement idol or issue a 100% full refund.
          </p>

          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">3. 100% Natural Material Assurance</h3>
          <p>
            All idols sold on our platform are guaranteed to be manufactured from 100% Godavari river clay and painted exclusively with organic turmeric, kumkum, and mineral colors.
          </p>
        </div>
      </div>
    </div>
  );
}

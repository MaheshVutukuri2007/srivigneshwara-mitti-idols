import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import LocationPickerMap from '../components/LocationPickerMap';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">Get In Touch</span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl">Vijayawada Store & Helpline</h1>
          <p className="text-xs text-stone-500">
            We are here to help you select the ideal eco-friendly Ganesh idol for your home or community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Info Card */}
          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              Sri Vigneshwara Store
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Address</p>
                  <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                    D.No. 73-1-5, MG Road, Patamata, Opp. High School Road Bus Stop, Vijayawada - 520010
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#FF7A00] shrink-0" />
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Phone Helpline</p>
                  <a href="tel:9390538027" className="text-[#FF7A00] font-bold">9390538027</a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">WhatsApp Orders</p>
                  <a href="https://wa.me/919390538027" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">
                    Click to Chat (9390538027)
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#FF7A00] shrink-0" />
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Working Hours</p>
                  <p className="text-stone-600 dark:text-stone-400">Monday - Sunday: 8:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-3xl border border-amber-900/10 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              Interactive Store Location Map
            </h3>
            <LocationPickerMap
              onLocationSelect={() => {}}
              initialLat={16.5062}
              initialLng={80.648}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

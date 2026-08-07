import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = '919390538027';
  const defaultText = encodeURIComponent(
    'Namaste! I would like to inquire about Sri Vigneshwara Eco-Friendly Clay Ganesh Idols in Vijayawada.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
    >
      <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        WhatsApp Helpline (9390538027)
      </span>
    </a>
  );
}

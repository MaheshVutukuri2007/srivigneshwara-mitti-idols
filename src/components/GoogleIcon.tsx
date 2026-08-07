import React from 'react';

export default function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.52h3.23c1.89-1.74 2.98-4.31 2.98-7.37Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.23-2.52c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.91V7.5H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.5l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.95 2.96 14.7 2 12 2a10 10 0 0 0-8.95 5.5l3.34 2.59C7.18 7.72 9.39 5.96 12 5.96Z" />
    </svg>
  );
}

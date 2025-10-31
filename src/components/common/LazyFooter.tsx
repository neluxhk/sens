// src/components/common/LazyFooter.tsx
import React from 'react';

// Carga diferida del Footer
const FooterLanding = React.lazy(() => import('../landing/FooterLanding'));

interface LazyFooterProps {
  onEnterApp: () => void;
}

export const LazyFooter: React.FC<LazyFooterProps> = (props) => {
  return (
    <React.Suspense 
      fallback={
        // ✅ Fallback simple mientras carga
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </footer>
      }
    >
      <FooterLanding {...props} />
    </React.Suspense>
  );
};
// src/components/common/LazyCTA.tsx
import React from 'react';

const CTALanding = React.lazy(() => import('../landing/CTALanding'));

interface LazyCTAProps {
  onEnterApp: () => void;
}

export const LazyCTA: React.FC<LazyCTAProps> = (props) => {
  return (
    <React.Suspense 
      fallback={
        // Fallback simple para la sección CTA
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-blue-500 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-blue-500 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-12 bg-blue-500 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </section>
      }
    >
      <CTALanding {...props} />
    </React.Suspense>
  );
};
import './i18n';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './components/landing/LandingPage';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<div>Loading translations...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage onEnterApp={() => window.location.href = '/app/estimator'} />} />
            <Route path="/app/estimator" element={<App />} />
            <Route path="/technical-sheet" element={<App />} />
            <Route path="*" element={<LandingPage onEnterApp={() => window.location.href = '/app/estimator'} />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);
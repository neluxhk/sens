// src/layouts/AppLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar'; // Asumimos que Navbar está en components

export const AppLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="py-8">
        <Outlet /> {/* Aquí se renderizarán las páginas de herramientas (Estimador, Ficha Técnica) */}
      </main>
    </div>
  );
};
import React from 'react'

export const Home: React.FC = () => (
  <section className="text-center py-20">
    <h2 className="text-3xl font-bold mb-4">Bienvenido a Sens</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Esta es tu base PWA con Vite + React + TypeScript + Tailwind + Firebase Hosting.
      Lista para añadir cálculos fotométricos, diagramas e inteligencia artificial.
    </p>
    <button className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition">
      Empezar
    </button>
  </section>
)

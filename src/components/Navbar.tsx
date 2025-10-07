import React from 'react'

export const Navbar: React.FC = () => (
  <header className="bg-sky-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="font-bold text-lg">Sens</h1>
      <nav>
        <ul className="flex gap-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Features</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
)

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <Compass className="text-gold mb-8 animate-pulse" size={80} />
        <h1 className="text-6xl md:text-9xl font-serif text-charcoal mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-6 tracking-widest uppercase">
          Sanctuary Not Found
        </h2>
        <p className="max-w-md text-gray-500 font-light mb-12 leading-relaxed">
          The sanctuary you are seeking has eluded our records. 
          Please wander back to our curated collection.
        </p>
        <Link to="/" className="btn-gold px-12 py-4">
          RETURN TO HOME
        </Link>
      </div>
      
      {/* Footer minimal decor */}
      <div className="py-12 flex justify-center opacity-20">
        <div className="w-16 h-[1px] bg-gold"></div>
      </div>
    </div>
  );
};

export default NotFound;

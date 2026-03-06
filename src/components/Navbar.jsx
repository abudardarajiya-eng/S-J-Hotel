import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#' },
    { name: 'ROOMS', href: '#rooms' },
    { name: 'BANQUET', href: '#banquet' },
    { name: 'GALLERY', href: '#gallery' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center">
          <span className={`text-2xl font-serif tracking-widest ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
            S&J
          </span>
          <span className={`text-[8px] tracking-[0.3em] font-sans -mt-1 ${isScrolled ? 'text-gold' : 'text-white/80'}`}>
            HOTEL & BANQUET
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href.startsWith('#') ? `/${link.href}` : link.href}
              className={`text-xs font-sans tracking-[0.15em] hover:text-gold transition-colors duration-300 ${
                isScrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/book" className="btn-gold ml-4">
            BOOK NOW
          </Link>
          <Link to="/admin" className={`text-[8px] tracking-widest opacity-20 hover:opacity-100 transition-opacity ml-4 ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
            ADMIN
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={isScrolled ? 'text-charcoal' : 'text-white'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-10 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-sans tracking-widest text-charcoal hover:text-gold"
                >
                  {link.name}
                </a>
              ))}
              <Link 
                to="/book" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold w-full max-w-xs text-center"
              >
                BOOK NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

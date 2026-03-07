import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const location = useLocation();
  const bookingDetails = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-40 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-16 shadow-sm border border-gold/10 text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center">
              <CheckCircle className="text-gold" size={40} />
            </div>
          </div>
          
          <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">Thank You</span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-8">Booking Confirmed</h1>
          <p className="text-gray-600 font-light leading-relaxed mb-12 max-w-lg mx-auto">
            Your reservation at S&J Hotel & Banquet has been successfully received. 
            We are preparing for your arrival and looking forward to hosting you soon.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left border-t border-b border-cream py-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-charcoal">
                <Calendar size={18} className="text-gold" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">Reservation Number</span>
              </div>
              <p className="text-sm font-medium pl-8">SJ-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-charcoal">
                <Mail size={18} className="text-gold" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">Confirmation Email</span>
              </div>
              <p className="text-sm font-medium pl-8">Sent to your inbox</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-charcoal">
                <MapPin size={18} className="text-gold" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">Location</span>
              </div>
              <p className="text-sm font-medium pl-8">Bhabua, Bihar, India</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/" className="btn-gold px-12">
              RETURN HOME
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingConfirmation;

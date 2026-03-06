import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const ContactMap = () => {
  return (
    <section id="contact" className="bg-charcoal text-white section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20">
          
          <div>
            <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">Find Us</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-12">Connect With S&J</h2>
            
            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <MapPin className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="text-xs tracking-widest font-sans text-gold uppercase mb-2">Location</h4>
                  <p className="text-lg font-light text-white/80">
                    Ward No.-4, S&J Mall,<br />
                    Bhabua, Bihar - 821101
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <Phone className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="text-xs tracking-widest font-sans text-gold uppercase mb-2">Reservations</h4>
                  <p className="text-lg font-light text-white/80">+91 91234 56789</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <Mail className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="text-xs tracking-widest font-sans text-gold uppercase mb-2">Inquiries</h4>
                  <p className="text-lg font-light text-white/80">hello@sjhotel.com</p>
                </div>
              </div>

              <div className="pt-6 flex space-x-6">
                <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] w-full bg-white/5 p-4 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.42531776961!2d83.6120406!3d25.0423456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e09f5f0000001%3A0x7d00000000000000!2sBhabua%2C%20Bihar!5e0!3m2!1sen!2sin!4v1709720000000!5m2!1sen!2sin" 
                className="w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border border-white/10"></div>
          </div>

        </div>

        <div className="mt-32 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.3em] font-sans text-white/40 uppercase text-center space-y-4 md:space-y-0">
          <span>&copy; 2026 S&J HOTEL & BANQUET. ALL RIGHTS RESERVED.</span>
          <div className="space-x-8">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Use</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;

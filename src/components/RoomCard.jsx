import React from 'react';
import { motion } from 'framer-motion';

const RoomCard = ({ room }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'} 
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 text-[10px] tracking-widest font-sans uppercase">
          ₹{room.price} / Night
        </div>
        {room.isOccupied && (
          <div className="absolute top-4 left-4 bg-red-500/90 text-white px-4 py-2 text-[10px] tracking-widest font-sans uppercase">
            Reserved
          </div>
        )}
      </div>
      
      <div className="p-10 text-center">
        <span className="text-gold text-[10px] tracking-[0.3em] font-sans uppercase mb-2 block">
          {room.category}
        </span>
        <h3 className="text-2xl font-serif text-charcoal mb-4 tracking-tight">
          {room.name}
        </h3>
        <p className="text-sm text-gray-500 font-light mb-8 line-clamp-2 leading-relaxed">
          {room.description}
        </p>
        
        <div className="flex justify-center space-x-6">
          <button className="text-[10px] tracking-[0.2em] font-sans uppercase text-charcoal border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-colors">
            VIEW DETAILS
          </button>
          <button className="text-[10px] tracking-[0.2em] font-sans uppercase text-gold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors">
            BOOK NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;

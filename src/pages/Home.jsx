import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookingBar from '../components/BookingBar';
import RoomCard from '../components/RoomCard';
import InquiryForm from '../components/InquiryForm';
import Reviews from '../components/Reviews';
import ContactMap from '../components/ContactMap';

const Home = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/rooms');
                setRooms(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);
  return (
    <div className="relative min-h-screen bg-cream">
      <Navbar />
      <Hero />
      
      {/* Featured Experience */}
      <section className="section-padding max-w-7xl mx-auto px-6 text-center">
        <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">The Experience</span>
        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
          A Symphony of Elegance & Comfort
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 font-light leading-relaxed mb-12">
          Nestled in the heart of Bhabua, S&J Hotel & Banquet offers an unparalleled sanctuary 
          where traditional hospitality meets modern luxury. Every detail is curated to provide 
          you with an unforgettable stay.
        </p>
        <div className="w-16 h-[1px] bg-gold mx-auto"></div>
      </section>

      {/* Rooms Grid */}
      <section id="rooms" className="pb-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </section>

      {/* Banquet Section */}
      <InquiryForm />

      {/* Guest Reviews */}
      <Reviews />

      {/* Contact & Map */}
      <ContactMap />

      {/* Spacing for sticky bar */}
      <div className="h-32"></div>
      
      <BookingBar />
    </div>
  );
}

export default Home;

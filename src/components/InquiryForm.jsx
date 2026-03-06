import React, { useState } from 'react';
import axios from 'axios';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    eventType: 'WEDDING',
    eventDate: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await axios.post(`${import.meta.env.VITE_API_URI}/api/inquiries`, {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: 'Not provided',
            eventType: formData.eventType,
            eventDate: formData.eventDate,
            guests: 50,
            message: formData.message
        });
        alert("Inquiry sent successfully! We will get back to you shortly.");
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            eventType: 'WEDDING',
            eventDate: '',
            message: ''
        });
    } catch (err) {
        console.error(err);
        alert("Error sending inquiry. Please check if the server is running.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section id="banquet" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        
        <div>
          <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">Events & Celebrations</span>
          <h2 className="text-4xl md:text-6xl font-serif text-charcoal mb-8 leading-tight">
            The Perfect Venue <br /> For Your Big Day
          </h2>
          <p className="text-gray-600 font-light leading-relaxed mb-10 max-w-lg">
            From majestic weddings to intimate corporate gatherings, our grand banquet halls
            provide the perfect backdrop for your most cherished moments. Our expert 
            planning team ensures every detail is executed with perfection.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold">
                <span>01</span>
              </div>
              <span className="text-sm tracking-widest uppercase font-medium">Grand Ballroom</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold">
                <span>02</span>
              </div>
              <span className="text-sm tracking-widest uppercase font-medium">Catering Excellence</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold">
                <span>03</span>
              </div>
              <span className="text-sm tracking-widest uppercase font-medium">Guest Accommodation</span>
            </div>
          </div>
        </div>

        <div className="bg-cream p-10 md:p-16">
          <h3 className="text-2xl font-serif mb-8 text-center text-charcoal">Plan Your Event</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="FIRST NAME"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors"
              />
              <input 
                type="text" 
                placeholder="LAST NAME"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors"
              />
            </div>
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors"
            />
            <div className="grid md:grid-cols-2 gap-6">
              <select 
                value={formData.eventType}
                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors appearance-none"
              >
                <option value="WEDDING">WEDDING</option>
                <option value="CORPORATE">CORPORATE</option>
                <option value="PARTY">PARTY</option>
              </select>
              <input 
                type="date" 
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors"
              />
            </div>
            <textarea 
              placeholder="TELL US MORE ABOUT YOUR EVENT"
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:border-gold outline-none transition-colors resize-none"
            ></textarea>
            
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-gold disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default InquiryForm;

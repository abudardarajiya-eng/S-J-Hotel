import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    text: "The banquet hall at S&J is simply magnificent. We held our daughter's wedding here and the service was world-class. The staff handled everything with such grace.",
    source: "Google Reviews"
  },
  {
    id: 2,
    name: "Anjali Singh",
    rating: 5,
    text: "A true gem in Bhabua. The rooms are spacious, clean and have a very premium feel. The food at the banquet was delicious. Highly recommended for stay and events.",
    source: "TripAdvisor"
  },
  {
    id: 3,
    name: "Vikram Mehta",
    rating: 4,
    text: "Excellent hospitality and very polite staff. The 'Quiet Luxury' theme is reflected in every corner. It's the best place for corporate meetings in the city.",
    source: "Direct Feedback"
  }
];

const Reviews = () => {
  return (
    <section className="bg-cream section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">Guest Stories</span>
          <h2 className="text-4xl font-serif text-charcoal">Exceptional Experiences</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-10 relative shadow-sm border border-cream hover:border-gold/20 transition-all duration-500">
              <Quote className="text-gold/20 absolute top-8 right-8" size={40} />
              
              <div className="flex mb-6 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    className={i < review.rating ? "text-gold" : "text-gray-300"}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 font-light leading-relaxed mb-8 italic">
                "{review.text}"
              </p>
              
              <div className="flex flex-col">
                <span className="text-sm font-sans tracking-widest uppercase font-semibold text-charcoal">
                  {review.name}
                </span>
                <span className="text-[10px] text-gray-400 tracking-widest font-sans uppercase">
                  {review.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-charcoal bg-white px-6 py-2 rounded-full border border-cream shadow-sm">
                <span className="text-lg font-serif">4.8</span>
                <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-[10px] tracking-widest font-sans text-gray-400 ml-2 uppercase">Average Rating</span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

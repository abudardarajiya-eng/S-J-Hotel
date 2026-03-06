import React, { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingBar = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 2
    });

    const handleSearch = () => {
        const query = new URLSearchParams(searchData).toString();
        navigate(`/book?${query}`);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-4 md:pb-0">
            <div className="max-w-6xl mx-auto bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-stretch border-t border-cream">
                
                {/* Check In */}
                <div className="flex-1 flex items-center px-8 py-4 border-b md:border-b-0 md:border-r border-cream group transition-colors">
                    <Calendar className="text-gold mr-4 shrink-0" size={18} />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase">CHECK IN</span>
                        <input 
                            type="date" 
                            className="text-xs font-medium bg-transparent outline-none focus:text-gold transition-colors"
                            value={searchData.checkIn}
                            onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                        />
                    </div>
                </div>

                {/* Check Out */}
                <div className="flex-1 flex items-center px-8 py-4 border-b md:border-b-0 md:border-r border-cream transition-colors">
                    <Calendar className="text-gold mr-4 shrink-0" size={18} />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase">CHECK OUT</span>
                        <input 
                            type="date" 
                            className="text-xs font-medium bg-transparent outline-none focus:text-gold transition-colors"
                            value={searchData.checkOut}
                            onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                        />
                    </div>
                </div>

                {/* Guests */}
                <div className="flex-1 flex items-center px-8 py-4 border-b md:border-b-0 md:border-r border-cream transition-colors">
                    <Users className="text-gold mr-4 shrink-0" size={18} />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase">GUESTS</span>
                        <select 
                            className="text-xs font-medium bg-transparent outline-none cursor-pointer"
                            value={searchData.guests}
                            onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                        >
                            <option value={1}>1 Adult</option>
                            <option value={2}>2 Adults</option>
                            <option value={3}>3 Adults</option>
                            <option value={4}>4 Adults</option>
                        </select>
                    </div>
                </div>

                {/* Action */}
                <button 
                    onClick={handleSearch}
                    className="bg-gold text-white px-12 py-6 md:py-0 font-sans text-xs tracking-[0.2em] font-bold hover:bg-charcoal transition-all flex items-center justify-center whitespace-nowrap"
                >
                    <Search size={16} className="mr-3" />
                    CHECK AVAILABILITY
                </button>

            </div>
        </div>
    );
};

export default BookingBar;

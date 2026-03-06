import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Users, Coffee, ShieldCheck, Star } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDates, setSearchDates] = useState({ 
        checkIn: searchParams.get('checkIn') || '', 
        checkOut: searchParams.get('checkOut') || '' 
    });
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingData, setBookingData] = useState({
        guestName: '',
        email: '',
        phone: '',
        guests: parseInt(searchParams.get('guests')) || 2
    });

    const [validationError, setValidationError] = useState('');

    const fetchOccupiedDates = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings/occupied-dates');
            setBookings(res.data);
        } catch (err) {
            console.error("Error fetching occupied dates:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/rooms'),
                    fetchOccupiedDates()
                ]);
                setRooms(roomRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        setValidationError('');
        const { checkIn, checkOut } = searchDates;
        
        if (!checkIn || !checkOut) {
            setValidationError('Please select both check-in and check-out dates.');
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (start < today) {
            setValidationError('Check-in date cannot be in the past.');
            return;
        }

        if (end <= start) {
            setValidationError('Check-out date must be after check-in date.');
            return;
        }

        // Trigger re-render to update room statuses
        setRooms([...rooms]); 
        const searchSection = document.getElementById('results-section');
        if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoom || !searchDates.checkIn || !searchDates.checkOut) {
            alert("Please select a room and dates");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/bookings', {
                roomId: selectedRoom._id,
                ...bookingData,
                checkIn: searchDates.checkIn,
                checkOut: searchDates.checkOut,
                totalPrice: selectedRoom.price // Simplified
            });
            alert("Booking submitted successfully! Our team will contact you for confirmation.");
            setSelectedRoom(null);
            setBookingData({ guestName: '', email: '', phone: '', guests: 2 }); // Reset form
            fetchOccupiedDates(); // Refresh availability
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting booking");
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />
            
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">Reservations</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-charcoal">Secure Your Stay</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Search & Rooms List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 shadow-sm flex flex-col items-stretch gap-6">
                            <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-[10px] tracking-widest uppercase font-semibold text-gray-400">Check In</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm"
                                        value={searchDates.checkIn}
                                        onChange={(e) => setSearchDates({...searchDates, checkIn: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-[10px] tracking-widest uppercase font-semibold text-gray-400">Check Out</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm"
                                        value={searchDates.checkOut}
                                        onChange={(e) => setSearchDates({...searchDates, checkOut: e.target.value})}
                                    />
                                </div>
                                <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSearch}
                                    className="btn-gold w-full md:w-auto px-10"
                                >
                                    SEARCH
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {validationError && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-[10px] tracking-widest uppercase font-bold"
                                    >
                                        {validationError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div id="results-section" className="space-y-6">
                            {loading ? (
                                <div className="text-center py-20 font-serif text-gray-400">Loading fine accommodations...</div>
                            ) : (
                                rooms.map(room => {
                                    const isOccupied = bookings.some(b => {
                                        const roomMatch = (b.roomId?._id || b.roomId) === room._id;
                                        if (!roomMatch) return false;

                                        const bStart = new Date(b.checkIn);
                                        const bEnd = new Date(b.checkOut);
                                        
                                        // Current occupancy check
                                        const now = new Date();
                                        const isNow = bStart <= now && bEnd >= now;

                                        // Search range check
                                        let isSearchOverlap = false;
                                        if (searchDates.checkIn && searchDates.checkOut) {
                                            const sStart = new Date(searchDates.checkIn);
                                            const sEnd = new Date(searchDates.checkOut);
                                            isSearchOverlap = bStart < sEnd && bEnd > sStart;
                                        }

                                        return isNow || isSearchOverlap;
                                    });

                                    return (
                                        <motion.div 
                                            key={room._id} 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`bg-white p-6 flex flex-col md:flex-row gap-8 items-center transition-all border ${
                                                isOccupied ? 'opacity-60 cursor-not-allowed border-red-50' : 
                                                selectedRoom?._id === room._id ? 'border-gold shadow-md cursor-pointer' : 'border-transparent hover:border-cream cursor-pointer'
                                            }`}
                                            onClick={() => !isOccupied && setSelectedRoom(room)}
                                        >
                                            <div className="w-full md:w-64 h-48 overflow-hidden relative">
                                                <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'} className="w-full h-full object-cover" alt={room.name} />
                                                {isOccupied && (
                                                    <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                                                        <span className="text-[10px] tracking-widest text-white border border-white px-4 py-2 uppercase font-bold">Occupied</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] text-gold uppercase tracking-widest font-sans mb-1 block">Room {room.roomNumber}</span>
                                                        <h3 className="text-2xl font-serif text-charcoal">{room.name}</h3>
                                                    </div>
                                                    <span className="text-gold font-semibold">₹{room.price} / Night</span>
                                                </div>
                                                <p className="text-sm text-gray-500 font-light line-clamp-2">{room.description}</p>
                                                <div className="flex gap-4">
                                                    {room.amenities.slice(0, 3).map(a => (
                                                        <span key={a} className="text-[10px] bg-cream px-3 py-1 uppercase tracking-widest text-gray-400">{a}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Booking Form Sidebar */}
                    <div className="bg-white p-10 shadow-sm h-fit sticky top-32">
                        <h2 className="text-2xl font-serif text-charcoal mb-8">Guest Details</h2>
                        {selectedRoom ? (
                            <form onSubmit={handleBookingSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm"
                                        onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm"
                                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required
                                        className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm"
                                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="w-full btn-gold mt-4">CONFIRM RESERVATION</button>
                                <p className="text-[10px] text-center text-gray-400 mt-4">
                                    Total due at hotel: <span className="text-charcoal font-semibold">₹{selectedRoom.price}</span>
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-10">
                                <Star className="mx-auto text-gold/20 mb-4" size={40} />
                                <p className="text-sm text-gray-400 font-light italic">
                                    Please select an accommodation <br /> to proceed with booking.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookingPage;

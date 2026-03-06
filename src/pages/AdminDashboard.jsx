import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Bed, Mail, Users, CheckCircle, Clock, XCircle, LogOut, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'rooms', 'inquiries'
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomForm, setRoomForm] = useState({
        roomNumber: '',
        name: '',
        description: '',
        price: '',
        category: 'Deluxe',
        amenities: ''
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [bookingRes, inquiryRes, roomRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/bookings', config),
                    axios.get('http://localhost:5000/api/inquiries', config),
                    axios.get('http://localhost:5000/api/rooms', config)
                ]);
                setBookings(bookingRes.data);
                setInquiries(inquiryRes.data);
                setRooms(roomRes.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/login');
                }
                console.error("Error fetching admin data:", err);
            }
        };
        fetchData();
    }, [token, navigate]);

    const updateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status }, config);
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (err) {
            alert("Error updating status");
        }
    };

    const deleteRoom = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/rooms/${id}`, config);
            setRooms(rooms.filter(r => r._id !== id));
        } catch (err) {
            alert("Error deleting room");
        }
    };

    const handleSubmitRoom = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...roomForm, amenities: roomForm.amenities.split(',').map(a => a.trim()) };
            
            if (editingRoom) {
                const res = await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, payload, config);
                setRooms(rooms.map(r => r._id === editingRoom._id ? res.data : r));
            } else {
                const res = await axios.post('http://localhost:5000/api/rooms', payload, config);
                setRooms([...rooms, res.data]);
            }
            setIsRoomModalOpen(false);
            setEditingRoom(null);
            setRoomForm({ roomNumber: '', name: '', description: '', price: '', category: 'Deluxe', amenities: '' });
        } catch (err) {
            alert("Error saving room");
        }
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setRoomForm({
            roomNumber: room.roomNumber,
            name: room.name,
            description: room.description,
            price: room.price,
            category: room.category,
            amenities: room.amenities.join(', ')
        });
        setIsRoomModalOpen(true);
    };

    // Helper to format date consistently
    const formatDate = (date) => new Date(date).toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-cream selection:bg-gold/30">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="space-y-2">
                        <span className="text-gold text-[10px] tracking-[0.4em] font-sans uppercase block">Management Portal</span>
                        <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Admin Dashboard</h1>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <button 
                            onClick={() => { setEditingRoom(null); setRoomForm({ roomNumber: '', name: '', description: '', price: '', category: 'Deluxe', amenities: '' }); setIsRoomModalOpen(true); }}
                            className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 text-[10px] tracking-widest uppercase hover:bg-gold transition-all shadow-lg"
                        >
                            <Plus size={14} /> Add New Room
                        </button>
                        <button 
                            onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-[10px] tracking-widest uppercase transition-all"
                        >
                            <LogOut size={14} /> Logout
                        </button>

                        <div className="flex gap-2 p-1 border border-cream bg-white/50 backdrop-blur rounded-full">
                            {[
                                { id: 'bookings', label: 'Bookings' },
                                { id: 'rooms', label: 'Room Status' },
                                { id: 'inquiries', label: 'Inquiries' }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2 rounded-full text-[10px] tracking-widest uppercase transition-all ${activeTab === tab.id ? 'bg-gold text-white shadow-sm' : 'text-gray-400 hover:text-charcoal'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white shadow-sm overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'bookings' && (
                            <motion.div 
                                key="bookings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="overflow-x-auto"
                            >
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-cream bg-cream/20">
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Guest</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Stay Dates</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Room</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Status</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cream/50">
                                        {bookings.length > 0 ? bookings.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-cream/10 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-charcoal">{booking.guestName}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{booking.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-sans text-gray-500 uppercase tracking-tighter">
                                                            {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] bg-cream px-3 py-1 rounded-full text-charcoal tracking-widest lowercase">
                                                        {booking.roomId?.name || 'Room Removed'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-medium tracking-widest uppercase ${
                                                            booking.status === 'Confirmed' ? 'text-green-600' : 
                                                            booking.status === 'Pending' ? 'text-gold' : 'text-red-400'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => updateStatus(booking._id, 'Confirmed')}
                                                            title="Confirm Booking"
                                                            className="w-8 h-8 rounded-lg border border-green-100 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(booking._id, 'Cancelled')}
                                                            title="Cancel Booking"
                                                            className="w-8 h-8 rounded-lg border border-red-50 flex items-center justify-center text-red-300 hover:bg-red-50 transition-colors"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="px-8 py-20 text-center text-sm text-gray-400 italic">No bookings found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'inquiries' && (
                            <motion.div 
                                key="inquiries"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="overflow-x-auto"
                            >
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-cream bg-cream/20">
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Inquirer</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Event Date</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Message</th>
                                            <th className="px-8 py-6 text-[10px] tracking-[0.2em] font-sans uppercase text-gray-400">Received</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cream/50">
                                        {inquiries.length > 0 ? inquiries.map((inquiry) => (
                                            <tr key={inquiry._id} className="hover:bg-cream/10 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-charcoal">{inquiry.name}</span>
                                                        <span className="text-[10px] text-gray-400 lowercase">{inquiry.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded tracking-tighter">
                                                        {formatDate(inquiry.eventDate)} ({inquiry.eventType})
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-xs text-gray-500 font-light line-clamp-1 max-w-xs">{inquiry.message}</p>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] text-gray-400">{formatDate(inquiry.createdAt)}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="px-8 py-20 text-center text-sm text-gray-400 italic">No inquiries found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'rooms' && (
                            <motion.div 
                                key="rooms"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-8"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-white p-6 border border-cream rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-gold">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] tracking-widest uppercase text-gray-400 block font-semibold">Viewing Status For</span>
                                            <input 
                                                type="date" 
                                                className="border-none p-0 outline-none text-sm font-serif text-charcoal bg-transparent"
                                                value={viewDate}
                                                onChange={(e) => setViewDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] tracking-widest uppercase text-gray-500 font-medium">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                            <span className="text-[10px] tracking-widest uppercase text-gray-500 font-medium">Occupied</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {rooms.map(room => {
                                        const queryStr = viewDate;
                                        const isOccupied = bookings.some(b => {
                                            // 1. Room ID match
                                            const bRoomId = (b.roomId?._id || b.roomId)?.toString();
                                            if (bRoomId !== room._id.toString()) return false;

                                            // 2. Status check
                                            if (b.status !== 'Confirmed' && b.status !== 'Checked-In') return false;

                                            // 3. Date range check
                                            const bStart = formatDate(b.checkIn);
                                            const bEnd = formatDate(b.checkOut);
                                            
                                            // Booking: Start is inclusive, End is exclusive (checkout day)
                                            return queryStr >= bStart && queryStr < bEnd;
                                        });

                                        return (
                                            <motion.div 
                                                layout
                                                key={room._id} 
                                                className="border border-cream p-6 rounded-2xl bg-white hover:shadow-xl transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-sans mb-1 block">{room.category}</span>
                                                        <h3 className="text-xl font-serif text-charcoal">Room {room.roomNumber}</h3>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-bold ${
                                                        isOccupied ? 'bg-red-50 text-red-500' : 
                                                        room.status === 'Maintenance' ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                        {isOccupied ? 'Occupied' : room.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="aspect-[4/3] bg-cream/30 rounded-xl overflow-hidden mb-6 relative">
                                                    <img 
                                                        src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'} 
                                                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOccupied ? 'grayscale' : ''}`}
                                                        alt={room.name} 
                                                    />
                                                    {isOccupied && (
                                                        <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[2px] flex items-center justify-center">
                                                            <div className="bg-white/90 px-4 py-2 rounded shadow-sm text-[10px] tracking-widest uppercase font-bold text-red-500">Booked</div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3 mb-6">
                                                    <div className="flex justify-between items-center text-[10px] tracking-widest uppercase">
                                                        <span className="text-gray-400">Tonight's Rate</span>
                                                        <span className="text-charcoal font-semibold">₹{room.price}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => openEditModal(room)}
                                                        className="flex-1 py-3 bg-cream/50 text-charcoal text-[9px] tracking-widest uppercase hover:bg-gold hover:text-white transition-all rounded-lg font-bold"
                                                    >
                                                        Edit Room
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteRoom(room._id)}
                                                        className="w-12 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Room Form Modal */}
            <AnimatePresence>
                {isRoomModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsRoomModalOpen(false)}
                            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white shadow-2xl p-10 overflow-y-auto max-h-[90vh] rounded-3xl"
                        >
                            <h2 className="text-3xl font-serif text-charcoal mb-8">{editingRoom ? 'Refine Room Details' : 'Introduce New Room'}</h2>
                            <form onSubmit={handleSubmitRoom} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Room Number</label>
                                        <input required className="w-full border-b border-cream py-2 outline-none focus:border-gold transition-colors text-sm"
                                            value={roomForm.roomNumber} onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})} placeholder="e.g. 101" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Category</label>
                                        <select className="w-full border-b border-cream py-2 outline-none focus:border-gold transition-colors text-sm bg-transparent"
                                            value={roomForm.category} onChange={(e) => setRoomForm({...roomForm, category: e.target.value})}>
                                            <option value="Deluxe">Deluxe</option>
                                            <option value="Executive">Executive</option>
                                            <option value="Suite">Suite</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Display Name</label>
                                    <input required className="w-full border-b border-cream py-2 outline-none focus:border-gold transition-colors text-sm"
                                        value={roomForm.name} onChange={(e) => setRoomForm({...roomForm, name: e.target.value})} placeholder="e.g. Deluxe Garden Room" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Price / Night (₹)</label>
                                        <input type="number" required className="w-full border-b border-cream py-2 outline-none focus:border-gold transition-colors text-sm"
                                            value={roomForm.price} onChange={(e) => setRoomForm({...roomForm, price: e.target.value})} placeholder="e.g. 4500" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Amenities (comma-separated)</label>
                                        <input className="w-full border-b border-cream py-2 outline-none focus:border-gold transition-colors text-sm"
                                            value={roomForm.amenities} onChange={(e) => setRoomForm({...roomForm, amenities: e.target.value})} placeholder="Wifi, TV, AC" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Description</label>
                                    <textarea className="w-full border border-cream p-4 outline-none focus:border-gold transition-colors text-sm h-32 resize-none rounded-xl"
                                        value={roomForm.description} onChange={(e) => setRoomForm({...roomForm, description: e.target.value})} placeholder="Describe the room experience..." />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 bg-gold text-white py-4 rounded-xl text-[10px] tracking-widest uppercase font-bold hover:bg-charcoal transition-all shadow-lg">
                                        {editingRoom ? 'Update Room' : 'Publish Room'}
                                    </button>
                                    <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-8 border border-cream text-[10px] tracking-widest uppercase rounded-xl hover:bg-cream/30 transition-all font-bold">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

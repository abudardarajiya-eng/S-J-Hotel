import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />
            
            <div className="pt-40 pb-20 px-6 flex justify-center items-center">
                <div className="w-full max-w-md bg-white p-10 shadow-sm">
                    <div className="text-center mb-10">
                        <span className="text-gold text-xs tracking-[0.4em] font-sans mb-4 block uppercase">System Access</span>
                        <h1 className="text-3xl font-serif text-charcoal">Admin Login</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2 relative">
                            <label className="text-[10px] tracking-widest uppercase font-semibold text-gray-400">Email Address</label>
                            <div className="flex items-center border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                                <Mail size={16} className="text-gray-300 mr-3" />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-transparent outline-none text-sm font-sans text-charcoal"
                                    placeholder="Enter your email"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] tracking-widest uppercase font-semibold text-gray-400">Password</label>
                            <div className="flex items-center border-b border-gray-200 py-2 focus-within:border-gold transition-colors">
                                <Lock size={16} className="text-gray-300 mr-3" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    className="w-full bg-transparent outline-none text-sm font-sans text-charcoal"
                                    placeholder="Enter your password"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-300 hover:text-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Lock size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] tracking-widest uppercase text-center font-medium animate-pulse">
                                {error}
                            </p>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-gold py-4 text-xs tracking-[0.2em] font-bold disabled:opacity-50"
                        >
                            {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                        </button>
                    </form>

                    <p className="text-[10px] text-center text-gray-400 mt-10 tracking-widest leading-loose">
                        RESTRICTED AREA <br /> 
                        S&J HOTEL MANAGEMENT SYSTEM &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

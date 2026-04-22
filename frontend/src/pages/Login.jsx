import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      window.location.href = '/'; // Refresh to update Navbar
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-black tracking-tighter mb-2">SIGN IN</h2>
        <p className="text-gray-400 mb-8 p-4 text-sm">Enter your details to access urban events.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-black border border-white/5 p-4 rounded-xl focus:border-purple-500 outline-none transition-all"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-black border border-white/5 p-4 rounded-xl focus:border-purple-500 outline-none transition-all"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 transform active:scale-95">
            LOG IN
          </button>
        </form>
        
        <p className="mt-8 p-4 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-white hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({ 
    fullName: '', email: '', password: '', role: 'USER' 
  });
  
  // State to hold field-specific errors from the backend
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors before the attempt
    
    try {
      await api.post('/auth/register', formData);
      alert("Registration successful!");
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Spring Boot validation errors are usually in err.response.data
        // Expecting { email: "Email invalid", password: "Password must be..." }
        setErrors(err.response.data);
      } else {
        alert("A server error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-black tracking-tighter mb-2 text-white">CREATE ACCOUNT</h2>
        <p className="text-gray-400 mb-8 text-sm">Join the urban community today.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-1">
            <input 
              type="text" placeholder="Full Name"
              className={`w-full bg-black border ${errors.fullName ? 'border-red-500' : 'border-white/5'} p-4 rounded-xl focus:border-purple-500 outline-none transition-all`}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <input 
              type="email" placeholder="Email Address"
              className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-white/5'} p-4 rounded-xl focus:border-purple-500 outline-none transition-all`}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <input 
              type="password" placeholder="Password (min. 6 chars)"
              className={`w-full bg-black border ${errors.password ? 'border-red-500' : 'border-white/5'} p-4 rounded-xl focus:border-purple-500 outline-none transition-all`}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password}</p>}
          </div>
          
          <select 
            className="w-full bg-black border border-white/5 p-4 rounded-xl focus:border-purple-500 outline-none appearance-none text-white"
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="USER">I want to attend events</option>
            <option value="ORGANIZER">I want to organize events</option>
          </select>

          <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 transform active:scale-95">
            GET STARTED
          </button>
        </form>
      </div>
    </div>
  );
}
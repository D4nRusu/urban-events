import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Adjust 'role' based on your JWT claim name (check your Backend JWT provider)
      userRole = decoded.role || decoded.authorities || null;
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-[#121212] sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
        <Calendar className="text-purple-500" size={28} />
        URBAN_EVENTS
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/" className="text-gray-400 hover:text-white font-medium transition">Explore</Link>

        {token ? (
          <>
            {/* Logic: If role is ORGANIZER, show Dashboard */}
            {userRole === 'ORGANIZER' && (
              <Link to="/dashboard" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
            {
              <Link to="/profile" className="text-gray-400 hover:text-white font-medium transition">My Profile</Link>
            }

            <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-red-500 transition">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-gray-400 hover:text-white font-medium">Sign In</Link>
            <Link to="/register" className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-purple-600 hover:text-white transition">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
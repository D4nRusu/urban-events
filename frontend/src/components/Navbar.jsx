import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <nav className="flex justify-between items-center p-6 border-b border-gray-800">
      <Link to="/" className="text-xl font-bold tracking-tighter">URBAN_EVENTS</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-accent">Browse</Link>
        {token ? (
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white">Logout</button>
        ) : (
          <Link to="/login" className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}
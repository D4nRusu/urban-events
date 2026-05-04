import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

import { jwtDecode } from 'jwt-decode';

function App() {
  const token = localStorage.getItem('token');
  
  const getRole = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (e) {
      return null;
    }
  };

  const userRole = getRole();

  return (
    <Router>
      <div className="min-h-screen bg-dark text-white">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Organizer Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Route - explicitly defined */}
          <Route 
            path="/admin" 
            element={userRole === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} 
          />

          {/* Catch-all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
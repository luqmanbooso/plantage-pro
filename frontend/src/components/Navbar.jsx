import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, History, LayoutDashboard, User, LogOut, Info, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div className="max-w-7xl w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 text-white group">
          <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Leaf className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">PlantAge <span className="text-emerald-400">Pro</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {user ? (
            <>
              <NavLink to="/predict" active={isActive('/predict')} icon={<Leaf className="w-4 h-4" />} label="Predict" />
              <NavLink to="/history" active={isActive('/history')} icon={<History className="w-4 h-4" />} label="History" />
              {isAdmin() && (
                <NavLink to="/admin" active={isActive('/admin')} icon={<Shield className="w-4 h-4" />} label="Admin" />
              )}
              <NavLink to="/profile" active={isActive('/profile')} icon={<User className="w-4 h-4" />} label="Profile" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:block font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 text-white font-medium hover:text-emerald-400 transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-lg shadow-white/5">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, icon, label }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${active
        ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(52,211,153,0.1)]'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
  >
    {icon}
    <span className="hidden lg:block font-medium">{label}</span>
  </Link>
);

export default Navbar;

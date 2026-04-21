import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, History, LayoutDashboard, User, LogOut, Info, Shield, Sparkles } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 pt-8 px-6 flex justify-center">
      <div className="max-w-7xl w-full flex justify-between items-center py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 text-white group">
          <div className="p-2 rounded-lg transition-transform duration-300">
             <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">Botanica <span className="text-white/40 italic">Pro</span></span>
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
    className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${active
        ? 'bg-white text-black font-bold'
        : 'text-gray-400 hover:text-white uppercase text-[10px] tracking-widest font-bold'
      }`}
  >
    {label === "Predict" ? <Sparkles className="w-4 h-4" /> : icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;

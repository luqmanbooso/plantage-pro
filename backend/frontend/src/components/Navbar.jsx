import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex bg-[#2c3f2d] border border-[#4ADE80] rounded-full px-3 py-1 items-center">
              <span className="text-[#4ADE80] font-medium text-sm">Green</span>
              <span className="text-white font-medium text-sm ml-1">Space</span>
            </div>
            <span className="font-semibold text-lg ml-3 text-white">PlantAge Pro</span>
          </Link>

          <div className="flex items-center space-x-6 text-sm text-gray-300">
            {!user ? (
              <>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-all border border-white/20">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/predict" className="hover:text-white transition-colors">Predict</Link>
                <Link to="/history" className="hover:text-white transition-colors">History</Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-[#4ADE80] hover:text-[#22c55e] transition-colors">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-red-400 transition-colors ml-4">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

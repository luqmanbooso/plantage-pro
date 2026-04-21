import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, BarChart3, Clock, Settings, LogOut, User } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total_predictions: 0, join_date: new Date() });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predictions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setStats({
            total_predictions: data.total || 0,
            join_date: user?.created_at || new Date()
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050d06] text-white pt-32 pb-20 px-6 relative overflow-hidden font-sans">
      
      {/* PERSISTENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src="/bg-leaves.png" alt="BG" className="absolute -top-20 -right-20 w-[60%] h-auto rotate-180 mix-blend-screen opacity-10 blur-[3px]" />
        <img src="/bg-leaves.png" alt="BG" className="absolute -bottom-40 -left-40 w-[60%] h-auto mix-blend-screen opacity-10" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="bg-[#0d160e] rounded-[40px] p-8 lg:p-12 border border-white/5 shadow-3xl mb-8 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-5xl font-black text-black shadow-[0_0_40px_rgba(52,211,153,0.2)] relative z-10 italic">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-[-10px] bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-400">
                 <div className="w-4 h-[1px] bg-emerald-400" />
                 <span className="text-[9px] uppercase font-black tracking-[0.4em]">Researcher Identity</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter">{user.full_name}</h1>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-6">
              <div className="flex items-center text-gray-500 space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-bold">{user.email}</span>
              </div>
              <div className="flex items-center text-emerald-500/80 space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] uppercase font-black tracking-widest">Master Specimenist</span>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard 
            label="Total Identifications" 
            value={stats.total_predictions} 
            icon={<BarChart3 className="w-6 h-6" />}
            color="emerald" 
          />
          <StatCard 
            label="Researcher Since" 
            value={new Date(stats.join_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} 
            icon={<Clock className="w-6 h-6" />}
            color="blue" 
          />
        </div>

        {/* Details Section */}
        <div className="bg-[#0d160e] rounded-[40px] p-8 lg:p-12 border border-white/5 overflow-hidden">
          <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black italic tracking-tight uppercase">Account Protocol</h2>
          </div>
          
          <div className="space-y-6">
            <DetailRow label="Account Hash" value={user.id || user._id} />
            <DetailRow label="Access Level" value="Botanical Elite" />
            <DetailRow label="Neural Status" value="Online / Syncing" active />
            <DetailRow label="Data Vault" value="AES-256 Encrypted" active />
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-[#0d160e] border border-white/5 p-8 rounded-[40px] flex items-center gap-6 group hover:border-white/10 transition-all">
    <div className={`p-4 rounded-3xl bg-white/5 text-white group-hover:bg-emerald-500 group-hover:text-black transition-all`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black italic leading-none">{value}</h3>
    </div>
  </div>
);

const DetailRow = ({ label, value, active }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{label}</span>
    <div className="flex items-center space-x-3">
      <span className="text-white font-mono text-xs">{value}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
    </div>
  </div>
);

export default Profile;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      navigate('/predict');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-plant-darkest text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <img src="/hero-bg.png" alt="" className="w-full h-full object-cover blur-sm" />
         <div className="absolute inset-0 bg-plant-darkest/60" />
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px]" />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* Logo */}
        <br /><br /><br /><br /><br />
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500 text-black mb-6 shadow-2xl shadow-emerald-500/20">
            <Leaf className="w-8 h-8" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">PlantAge <span className="text-emerald-400">Pro</span></h1>
          <p className="text-gray-400 mt-3 font-medium">Access your botanical analytics vault.</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 lg:p-10">
          <h2 className="text-2xl font-bold mb-8 text-white/90">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-12"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="btn-premium-primary w-full py-4 text-lg flex justify-center items-center group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400">
              New to the platform?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-white font-bold transition-colors">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

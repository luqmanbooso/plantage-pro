import React, { useState } from 'react';
import { authService } from '../services';
import { FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }

    setLoading(false);
  };

  if (submitted) {
    return (
  return (
    <div className="min-h-screen bg-plant-darkest text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <img src="/hero-bg.png" alt="" className="w-full h-full object-cover blur-sm" />
      </div>
      
      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 text-emerald-400 mb-6 shadow-2xl">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Recovery <span className="text-emerald-400">Hub</span></h1>
          <p className="text-gray-400 mt-2">Re-establish access to your archives.</p>
        </div>

        <div className="glass-card p-8 lg:p-10 relative">
          <div className="absolute top-0 right-0 p-4">
             <Sparkles className="w-5 h-5 text-emerald-500/20" />
          </div>

          {message ? (
            <div className="text-center space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-4 rounded-2xl text-sm">
                {message}
              </div>
              <Link to="/login" className="btn-premium-primary w-full inline-flex justify-center items-center">
                Return to Entry
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-premium pl-12"
                      placeholder="name@example.com"
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
                      <span>Send Link</span>
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

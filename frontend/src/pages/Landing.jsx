import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Star, CheckCircle2, Zap, Shield, Sparkles } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-plant-darkest text-white overflow-hidden font-sans pt-24">
      
      {/* Hero Section */}
      <section className="relative px-6 pt-12 lg:pt-20 pb-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-[120%] pointer-events-none opacity-40">
           <img 
             src="/hero-bg.png" 
             alt="Background" 
             className="w-full h-full object-cover object-center scale-110 blur-sm"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-plant-darkest via-transparent to-plant-darkest" />
           <div className="absolute inset-0 bg-gradient-to-r from-plant-darkest via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-10 animate-fade-in">
             <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Plant Care AI</span>
             </div>

             <h1 className="text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
               Elevate your <br />
               <span className="text-emerald-400">Green Space</span>
             </h1>

             <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
               Estimate your plant's age with scientific precision. Our AI-powered platform turns simple measurements into valuable growth insights.
             </p>

             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
               <Link to={user ? "/predict" : "/register"} className="btn-premium-primary text-center group">
                 Launch Predictor
                 <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link to="/about" className="btn-premium-outline text-center">
                 How it works
               </Link>
             </div>

             <div className="flex items-center space-x-10 pt-10 border-t border-white/10">
                <Metric label="10 Years" sub="on the market" />
                <Metric label="500+" sub="projects active" />
                <Metric label="99%" sub="accuracy rate" />
             </div>
          </div>

          <div className="relative animate-slide-up">
             <div className="glass-card p-1 pb-16 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative overflow-hidden rounded-xl m-4 h-96">
                   <img 
                     src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600" 
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                     alt="Premium Plant" 
                   />
                </div>

                <div className="px-8 flex justify-between items-center group-hover:translate-y-[-5px] transition-transform">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-bold">Predictor Pro</h3>
                      <p className="text-gray-400 text-sm">Advanced ML Analysis</p>
                   </div>
                   <Link to={user ? "/predict" : "/register"} className="p-4 bg-white text-black rounded-2xl hover:bg-emerald-50 transition-colors shadow-xl">
                      <ArrowRight className="w-6 h-6" />
                   </Link>
                </div>
             </div>
             
             {/* Floating Info card */}
             <div className="absolute -bottom-6 -right-6 lg:-right-12 glass-panel p-6 rounded-2xl shadow-3xl animate-bounce-slow">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Zap className="text-black w-6 h-6" fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Latency</p>
                      <p className="text-xl font-bold">&lt; 2 seconds</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32">
         <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold">Innovation in every leaf</h2>
            <p className="text-gray-400 max-w-2xl mx-auto italic">Why hundreds of botanical enthusiasts trust PlantAge Pro for their data.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              num="01" 
              title="Hyper Accuracy" 
              desc="Our model is trained on thousands of data points across species." 
              icon={<Star className="w-6 h-6 text-emerald-400" />}
            />
            <FeatureCard 
              num="02" 
              title="Instant Results" 
              desc="Get your prediction in real-time without manual calculations." 
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
            />
            <FeatureCard 
              num="03" 
              title="History Vault" 
              desc="All your predictions are securely saved for future reference." 
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
            />
            <FeatureCard 
              num="04" 
              title="Seamless UX" 
              desc="Designed for both mobile and desktop with a focus on speed." 
              icon={<Sparkles className="w-6 h-6 text-emerald-400" />}
            />
         </div>
      </section>

    </div>
  );
}

const Metric = ({ label, sub }) => (
  <div className="space-y-1">
    <span className="block text-3xl font-bold text-white leading-none">{label}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{sub}</span>
  </div>
);

const FeatureCard = ({ num, title, desc, icon }) => (
  <div className="glass-panel p-8 rounded-3xl group hover:bg-white/10 transition-all duration-500 flex flex-col items-start space-y-6">
    <div className="flex justify-between w-full items-start">
       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-500 group-hover:text-black">
          {icon}
       </div>
       <span className="text-4xl font-light text-white/10 group-hover:text-emerald-500/20 transition-colors duration-500 italic">{num}</span>
    </div>
    <div className="space-y-3">
       <h3 className="text-xl font-bold">{title}</h3>
       <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);


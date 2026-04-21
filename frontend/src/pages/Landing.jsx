import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Sparkles, Share2, MousePointer2, ChevronRight } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#050d06] text-white overflow-hidden font-sans pt-20">
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] bg-emerald-800/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <section className="py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-12 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter italic">
                Premium <br />
                <span className="text-emerald-400 not-italic">Flower</span> <br />
                <span className="text-white/40">Studio</span>
              </h1>
              <div className="max-w-sm">
                <p className="text-gray-400 leading-relaxed text-sm">
                  We create immersive data-driven growth experiences for your botanical collection. 
                  Identify species and predict age with cinematic precision.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to={user ? "/predict" : "/register"} 
                className="group relative px-8 py-4 bg-emerald-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                  Launch Predictor
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <button className="px-8 py-4 border border-white/10 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-colors">
                Explore Gallery
              </button>
            </div>

            <div className="flex gap-12 pt-8 border-t border-white/5">
               <HeroStat label="100+" sub="Species Cataloged" />
               <HeroStat label="99.4%" sub="Model Accuracy" />
            </div>
          </div>

          <div className="lg:w-1/2 relative">
             <div className="relative z-10 w-full max-w-md mx-auto animate-float">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  <img 
                    src="/hero-terrarium.png" 
                    alt="Main Plant Terrarium" 
                    className="relative z-10 w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)]"
                  />
                </div>
             </div>
             
             {/* Floating Badge */}
             <div className="absolute top-20 right-0 lg:-right-10 bg-white shadow-2xl rounded-2xl p-4 rotate-3 animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <Sparkles className="text-emerald-400 w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-black text-[10px] font-black uppercase tracking-tighter">AI Precision</p>
                      <p className="text-black text-lg font-bold leading-none">v4.2 PRO</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURED SAMPLES SECTION */}
        <section className="py-32 space-y-20">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-4 h-[2px] bg-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Our Collections</span>
                 </div>
                 <h2 className="text-5xl font-black italic">Featured Specimens</h2>
              </div>
              <div className="flex gap-4">
                <Share2 className="w-6 h-6 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                <span className="text-sm font-bold text-gray-500">18.4K <span className="font-normal opacity-50">Seeds Collected</span></span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <SpecimenCard 
                img="/plant-card-1.png"
                name="Calathea Ornata"
                category="Interior Decor"
                id="ID: 004-MS"
              />
              <SpecimenCard 
                img="/plant-card-2.png"
                name="Ficus Lyrata"
                category="Tropical"
                id="ID: 012-BY"
              />
              <SpecimenCard 
                img="/plant-card-3.png"
                name="Maranta Leuconeura"
                category="Rare Series"
                id="ID: 007-RS"
              />
           </div>
        </section>

        {/* BOTTOM METRIC / CTA */}
        <section className="py-24 border-t border-white/5">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-start gap-6">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl">
                    <MousePointer2 className="w-8 h-8 text-emerald-400" />
                 </div>
                 <div className="max-w-xs">
                    <h4 className="text-xl font-bold mb-2 italic">Interactive Growth</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                       Our new pixel-aware engine analyzes growth patterns monthly to ensure your data stays accurate over years.
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <p className="text-[40px] font-black leading-none tracking-tighter">07.2<span className="text-lg text-emerald-400">ms</span></p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Fast Scans</p>
                 </div>
                 <div className="h-12 w-[1px] bg-white/10" />
                 <div className="text-right">
                    <p className="text-[40px] font-black leading-none tracking-tighter">20.3<span className="text-lg text-emerald-400">PB</span></p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Data Processed</p>
                 </div>
              </div>
           </div>
        </section>

      </div>

      <footer className="py-10 text-center border-t border-white/5 opacity-30">
         <p className="text-[10px] uppercase tracking-[0.5em]">PlantAge Pro © 2026</p>
      </footer>
    </div>
  );
}

const HeroStat = ({ label, sub }) => (
  <div className="space-y-1">
    <span className="block text-4xl font-black tracking-tighter italic">{label}</span>
    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{sub}</span>
  </div>
);

const SpecimenCard = ({ img, name, category, id }) => (
  <div className="group relative bg-[#0d160e] rounded-[40px] p-8 overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-2 shadow-2xl">
     <div className="absolute top-0 left-0 w-full h-[120%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent" />
     </div>
     
     <div className="relative z-10 space-y-8">
        <div className="h-64 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
          <img src={img} alt={name} className="h-full w-full object-contain" />
        </div>
        
        <div className="space-y-4">
           <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{category}</p>
              <h3 className="text-2xl font-bold">{name}</h3>
           </div>
           
           <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] text-emerald-400 font-mono">{id}</span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                 <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
              </div>
           </div>
        </div>
     </div>
  </div>
);

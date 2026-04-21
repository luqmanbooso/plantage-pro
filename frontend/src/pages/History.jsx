import React, { useState, useEffect } from 'react';
import { predictionService } from '../services';
import { Search, Trash2, Download, Calendar, Leaf, Filter, X, ChevronRight, Sparkles } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (startDate) params.start_date = new Date(startDate).toISOString();
      if (endDate) params.end_date = new Date(endDate).toISOString();
      const response = await predictionService.getAll(params);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPredictions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      await predictionService.delete(id);
      fetchPredictions();
    } catch (error) {
       console.error('Delete failed:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await predictionService.clear();
      fetchPredictions();
      setShowClearModal(false);
    } catch (error) {
      console.error('Clear failed:', error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await predictionService.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `specimen-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030703] text-white pt-32 pb-20 px-6 relative overflow-hidden font-sans">
      
      {/* PERSISTENT BACKGROUND - Toned down */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src="/bg-leaves.png" alt="BG" className="absolute -top-20 -right-20 w-[60%] h-auto rotate-180 mix-blend-screen opacity-[0.03] blur-[5px]" />
        <img src="/bg-leaves.png" alt="BG" className="absolute -bottom-40 -left-40 w-[60%] h-auto mix-blend-screen opacity-[0.03] blur-[2px]" />
        
        {/* Subtler Ambient Glows */}
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-emerald-900/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-emerald-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
               <div className="w-6 h-[1px] bg-emerald-400" />
               <span className="text-[9px] uppercase font-black tracking-[0.4em]">Botanical Log</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none">
              Growth <br />
              <span className="text-emerald-400 not-italic uppercase tracking-tighter">Archives</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
             <button onClick={handleExport} className="px-6 py-3 border border-white/10 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Specimen Log
             </button>
             <button onClick={() => setShowClearModal(true)} className="px-6 py-3 bg-red-500/10 text-red-500 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Wipe Archives
             </button>
          </div>
        </div>

        {/* List Card Area */}
        <div className="space-y-4">
           {/* Search Bar */}
           <div className="bg-white/5 border border-white/5 rounded-3xl p-2 flex items-center gap-4 focus-within:border-emerald-500/30 transition-all">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                 <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search by species tag..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full py-2 placeholder:text-gray-600"
              />
           </div>

           {loading ? (
             <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
             </div>
           ) : predictions.length === 0 ? (
             <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-center mx-auto grayscale">
                   <Leaf className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black italic">Log is Empty</p>
                   <p className="text-xs text-gray-500 uppercase tracking-widest font-black">No specimens identified yet</p>
                </div>
             </div>
           ) : (
             predictions.map((pred, i) => (
                <div key={pred.id} className="group bg-[#080c08] border border-white/5 rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between hover:border-emerald-500/30 transition-all duration-500 gap-8">
                   <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
                         
                         <Leaf className="w-7 h-7 relative z-10" />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-xl font-black italic">{pred.plant_name || 'Incognito Specimen'}</h3>
                         <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-gray-600">
                            <span>{new Date(pred.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-emerald-400/50"># {pred.id.slice(-6)}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between w-full md:w-auto md:gap-12 pl-24 md:pl-0">
                      <div>
                         <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-1">Final Result</p>
                         <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black italic group-hover:text-emerald-400 transition-colors uppercase">{Math.round(pred.predicted_age)}</span>
                           <span className="text-xs font-black uppercase text-gray-600">Days</span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <button onClick={() => handleDelete(pred.id)} className="p-4 bg-red-500/5 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                            <Trash2 className="w-5 h-5" />
                         </button>
                         <ChevronRight className="w-5 h-5 text-gray-800" />
                      </div>
                   </div>
                </div>
             ))
           )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title="Wipe Archives"
        message="Are you certain you want to erase your entire prediction history? This cryptographic action cannot be reversed."
        confirmText="Confirm Deletion"
        danger={true}
      />
    </div>
  );
};

export default History;

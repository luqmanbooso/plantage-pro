import React, { useState, useEffect } from 'react';
import { predictionService } from '../services';
import { Search, Trash2, Download, Calendar, Leaf, Filter, X, ChevronRight } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

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
      console.error('Failed to delete prediction:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await predictionService.clear();
      fetchPredictions();
      setShowClearModal(false);
    } catch (error) {
      console.error('Failed to clear predictions:', error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await predictionService.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plant-predictions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export predictions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-plant-darkest text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] -z-10" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Growth <span className="text-emerald-400">Archives</span></h1>
            <p className="text-gray-400 text-lg">Your botanical journey, quantified by AI.</p>
          </div>
          
          <div className="flex items-center space-x-3">
             <button 
               onClick={handleExport}
               className="btn-premium-outline flex items-center space-x-2 py-2"
               disabled={predictions.length === 0}
             >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export CSV</span>
             </button>
             <button 
               onClick={() => setShowClearModal(true)}
               className="px-6 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
               disabled={predictions.length === 0}
             >
                Clear History
             </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text"
                placeholder="Search history by plant name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-emerald-500/30 transition-all"
              />
           </div>
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className={`p-3 rounded-xl border transition-all ${isFilterOpen ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/5 text-gray-400'}`}
           >
              <Filter className="w-5 h-5" />
           </button>
        </div>

        {/* Expandable Filters */}
        {isFilterOpen && (
          <div className="glass-card mb-8 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in relative">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-premium pl-12 py-2 text-sm"
                  />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-premium pl-12 py-2 text-sm"
                  />
                </div>
             </div>
             <button 
               onClick={() => { setStartDate(''); setEndDate(''); }}
               className="md:col-span-2 text-xs text-emerald-400 hover:text-white transition-colors flex items-center justify-center p-2"
             >
                <X className="w-3 h-3 mr-1" /> Reset Filters
             </button>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20">
             <LoadingSpinner />
          </div>
        ) : predictions.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                <Leaf className="w-10 h-10" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold">No Records Found</h3>
                <p className="text-gray-400 max-w-xs mx-auto">Either you haven't made any predictions yet or your filters are too strict.</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {predictions.map((pred, i) => (
               <div 
                 key={pred.id} 
                 className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between group hover:bg-white/[0.07] transition-all duration-300 animate-slide-up"
                 style={{ animationDelay: `${i * 0.05}s` }}
               >
                  <div className="flex items-center space-x-6">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <Leaf className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold flex items-center">
                           {pred.plant_name || 'Unnamed Sample'}
                           <span className="ml-3 text-[10px] bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-tighter text-gray-500">#{pred.id.slice(-4)}</span>
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                           <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(pred.created_at).toLocaleDateString()}</span>
                           <span className="flex items-center">Value: {pred.measurement_value}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end mt-4 md:mt-0 space-x-8">
                     <div className="text-center md:text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Predicted Age</p>
                        <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                           {pred.predicted_age} <span className="text-xs font-medium text-gray-500">years</span>
                        </p>
                     </div>
                     <button 
                       onClick={() => handleDelete(pred.id)}
                       className="p-3 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                       title="Delete record"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-gray-700 md:block hidden" />
                  </div>
               </div>
             ))}
          </div>
        )}
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

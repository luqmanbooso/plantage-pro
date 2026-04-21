import React, { useState, useRef } from 'react';
import { predictionService } from '../services';
import { Leaf, Sparkles, RefreshCcw, Share2, Camera } from 'lucide-react';

const Predict = () => {
  const [plantName, setPlantName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Unsupported format. Use JPEG/PNG.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (plantName) formData.append('plant_name', plantName);
      const response = await predictionService.upload(formData);
      setResult(response.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAgain = () => {
    setPlantName('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050d06] text-white pt-24 pb-12 px-6 relative overflow-hidden font-sans">
      
      {/* PERSISTENT BACKGROUND - Never disappears */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img 
          src="/bg-leaves.png" 
          alt="Overlay" 
          className="absolute -top-20 -right-20 w-[50%] h-auto rotate-180 mix-blend-screen opacity-20 blur-[3px]" 
        />
        <img 
          src="/bg-leaves.png" 
          alt="Overlay" 
          className="absolute -bottom-40 -left-40 w-[60%] h-auto mix-blend-screen opacity-15 blur-[1px]" 
        />
        {/* Ambient Glows */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-emerald-800/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {!result ? (
          <div className="grid lg:grid-cols-2 gap-10 items-center animate-fade-in lg:pt-10">
            {/* Left: Branding & Text */}
            <div className="space-y-8">
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <div className="w-5 h-[2px] bg-emerald-400" />
                    <span className="text-[8px] uppercase font-black tracking-[0.4em]">Autonomous AI Vision</span>
                 </div>
                 <h1 className="text-4xl lg:text-5xl font-black leading-none tracking-tighter italic">
                    Specimen <br />
                    <span className="text-emerald-400 not-italic uppercase tracking-tighter">Scanner</span>
                 </h1>
                 <p className="text-gray-400 max-w-sm text-[11px] leading-relaxed opacity-70">
                   Initiate high-fidelity pixel analysis for your botanical specimens. 
                   Our engine estimates age with scientific precision.
                 </p>
               </div>

               <div className="flex items-center gap-6 grayscale opacity-20">
                  <StatMini label="v4.2" sub="Engine" />
                  <StatMini label="0.7s" sub="Latency" />
                  <StatMini label="Secure" sub="SSL" />
               </div>
            </div>

            {/* Right: Upload Box (Scaled Down) */}
            <div className="glass-card max-w-md mx-auto p-1 overflow-hidden relative group rounded-[32px] border-white/5 shadow-2xl">
                <form onSubmit={handlePhotoSubmit} className="p-6 space-y-6 relative z-10">
                   {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest text-center rounded-xl">{error}</div>}
                   
                   <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-widest text-gray-500 ml-4">Identification Name (Opt)</label>
                      <input
                        type="text"
                        value={plantName}
                        onChange={(e) => setPlantName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-emerald-500/50 transition-colors text-xs font-bold"
                        placeholder="Tag your specimen..."
                      />
                   </div>

                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-square w-full rounded-[24px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-black/40 ${previewUrl ? 'border-emerald-500/40' : 'border-white/5 hover:border-emerald-500/20'}`}
                   >
                      {previewUrl ? (
                         <>
                           <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                           {loading && (
                             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                                {/* The Scanning Beam */}
                                <div className="w-full h-[2px] bg-emerald-400 shadow-[0_0_20px_#34d399] absolute top-[-5%] left-0 z-20 animate-scanner-beam" />
                                <div className="flex flex-col items-center gap-3 relative z-30">
                                   <div className="w-8 h-8 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 drop-shadow-md">Analyzing Pixels</span>
                                </div>
                             </div>
                           )}
                         </>
                      ) : (
                         <div className="flex flex-col items-center gap-3 text-gray-600">
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-black transition-all">
                               <Camera className="w-6 h-6" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest">Capture Specimen</span>
                         </div>
                      )}
                   </div>

                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                   <button
                     disabled={loading || !selectedFile}
                     className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-[16px] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
                   >
                      <Sparkles className="w-4 h-4" />
                      <span>{loading ? 'Processing...' : 'Execute Scan'}</span>
                   </button>
                </form>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW - PERSISTENT BACKGROUND CONTINUES */
          <div className="animate-blur-in max-w-4xl mx-auto lg:pt-6">
             <div className="bg-[#0d160e]/80 backdrop-blur-xl rounded-[40px] p-8 border border-white/5 shadow-3xl flex flex-col lg:flex-row gap-10 items-center">
                
                <div className="lg:w-2/5 relative group">
                   <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full opacity-30" />
                   <img src={previewUrl} alt="Analysis" className="relative z-10 w-full aspect-square object-cover rounded-[32px] shadow-2xl border border-white/10" />
                </div>

                <div className="lg:w-3/5 space-y-8 w-full">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <div className="w-3 h-[1px] bg-emerald-400" />
                          <span className="text-[9px] uppercase font-black tracking-widest">Report</span>
                        </div>
                        <h2 className="text-3xl font-black italic">{result.plant_name || "Unknown Flora"}</h2>
                      </div>
                      <Share2 className="text-gray-600 hover:text-white cursor-pointer transition-colors w-5 h-5" />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <MetricCard label="Confidence" value={`${(result.confidence * 100).toFixed(1)}%`} />
                      <MetricCard label="Detected" value={`${result.measurement_value} cm`} />
                   </div>

                   <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-2">Estimated Age</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-7xl font-black italic text-white tracking-tighter leading-none">{Math.round(result.predicted_age)}</span>
                         <span className="text-xl font-black uppercase text-emerald-400 italic">Days</span>
                      </div>
                   </div>

                   <button
                     onClick={handlePredictAgain}
                     className="w-full py-4 border border-white/10 rounded-xl flex items-center justify-center gap-3 group hover:bg-white/5 transition-all"
                   >
                      <RefreshCcw className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-700" />
                      <span className="text-[9px] font-black uppercase tracking-widest">New Scan</span>
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StatMini = ({ label, sub }) => (
  <div>
    <p className="text-lg font-black italic leading-none">{label}</p>
    <p className="text-[7px] uppercase tracking-widest font-black text-gray-600">{sub}</p>
  </div>
);

const MetricCard = ({ label, value }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-5">
    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">{label}</p>
    <p className="text-lg font-bold italic">{value}</p>
  </div>
);

export default Predict;

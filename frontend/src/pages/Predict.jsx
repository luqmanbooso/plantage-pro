import React, { useState, useRef } from 'react';
import { predictionService } from '../services';
import { Leaf, Info, Sparkles, RefreshCcw, Calendar, Ruler, CheckCircle2, Upload, Box, Image as ImageIcon, Camera } from 'lucide-react';

const Predict = () => {
  const [mode, setMode] = useState('photo'); // 'photo' or 'manual'
  const [plantName, setPlantName] = useState('');
  const [measurementValue, setMeasurementValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await predictionService.create({
        plant_name: plantName || null,
        measurement_value: parseFloat(measurementValue)
      });
      setResult(response.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
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
      setError(err.response?.data?.error || 'Image analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAgain = () => {
    setPlantName('');
    setMeasurementValue('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#111311] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-green-500/5 blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        {!result ? (
          <div className="animate-fade-in relative z-10">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Plant Age <span className="text-emerald-400">Predictor</span></h1>
              <p className="text-gray-400 max-w-md mx-auto text-lg">Use AI Vision to scan your plant or input measurements manually.</p>
              
              {/* Mode Toggle */}
              <div className="flex justify-center mt-8">
                <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                   <button 
                    onClick={() => setMode('photo')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${mode === 'photo' ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
                   >
                     <ImageIcon className="w-4 h-4" />
                     <span>Photo Scan</span>
                   </button>
                   <button 
                    onClick={() => setMode('manual')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${mode === 'manual' ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
                   >
                     <Ruler className="w-4 h-4" />
                     <span>Manual Entry</span>
                   </button>
                </div>
              </div>
            </div>

            <div className="glass-card max-w-xl mx-auto p-8 lg:p-12 relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={mode === 'photo' ? handlePhotoSubmit : handleManualSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 ml-1 uppercase tracking-wider">Plant Name (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={plantName}
                      onChange={(e) => setPlantName(e.target.value)}
                      className="input-premium pl-12"
                      placeholder="e.g., Ficus Lyrata"
                    />
                    <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                {mode === 'manual' ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Measurement Value</label>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-emerald-500 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 border border-white/10 rounded-lg text-[10px] text-gray-300 hidden group-hover:block backdrop-blur-md shadow-2xl">
                          Enter the numeric value (centimeters or inches).
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={measurementValue}
                        onChange={(e) => setMeasurementValue(e.target.value)}
                        className="input-premium pl-12 font-mono text-lg"
                        placeholder="0.00"
                        required
                      />
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <label className="text-sm font-semibold text-gray-300 ml-1 uppercase tracking-wider">Upload Plant Photo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-[4/3] w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group/upload ${previewUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'}`}
                    >
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover/upload:scale-105" />
                          {loading && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] absolute left-0 z-20 animate-scan" />
                              <div className="flex flex-col items-center space-y-3 z-30">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">AI Scanning...</span>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/70 hover:text-white transition-colors">
                            <Camera className="w-5 h-5" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center space-y-4 text-gray-500 group-hover:text-emerald-400 transition-colors">
                          <div className="p-4 rounded-full bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                            <Upload className="w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Click to upload photo</p>
                            <p className="text-xs">Supports JPG, PNG (Max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === 'manual' ? !measurementValue : !selectedFile)}
                  className="btn-premium-primary w-full py-4 text-lg flex justify-center items-center space-x-3 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{mode === 'photo' ? 'Analyzing Image...' : 'Calculating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>{mode === 'photo' ? 'Run AI Vision Scan' : 'Run Prediction Engine'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-blur-in max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Calculation Complete
              </div>
              <h2 className="text-4xl font-bold">Your Results</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResultCard 
                label="Estimated Height" 
                value={result.measurement_value} 
                unit="cm" 
                icon={<Ruler className="w-5 h-5" />} 
              />
              <ResultCard 
                label="Identified As" 
                value={result.plant_name || "Unknown"} 
                unit="" 
                icon={<Leaf className="w-5 h-5" />} 
              />
              <ResultCard 
                label="AI Confidence" 
                value={result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : "N/A"} 
                unit="" 
                icon={<Sparkles className="w-5 h-5" />} 
              />
              <ResultCard 
                label="Analyzed On" 
                value={new Date(result.created_at).toLocaleDateString()} 
                unit="" 
                icon={<Calendar className="w-5 h-5" />} 
              />
            </div>

            <div className="glass-card overflow-hidden group">
               <div className="bg-gradient-to-br from-emerald-500/20 to-transparent p-12 lg:p-16 flex flex-col items-center text-center space-y-6">
                  <p className="text-gray-400 uppercase tracking-widest font-bold text-sm">Estimated Plant Age</p>
                  <div className="relative">
                    <span className="text-8xl lg:text-9xl font-black text-white">{result.predicted_age}</span>
                    <span className="text-2xl font-bold text-emerald-400 ml-2">years</span>
                    <div className="absolute -inset-4 bg-emerald-500/20 blur-[50px] opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <p className="text-gray-400 max-w-xs">Our ML model suggests this plant is approximately {result.predicted_age} years old based on the analysis.</p>
               </div>
               <div className="bg-white/5 border-t border-white/10 p-6 flex justify-center">
                  <button
                    onClick={handlePredictAgain}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-semibold uppercase tracking-tighter">New Prediction</span>
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, unit, icon }) => (
  <div className="glass-panel p-6 rounded-2xl space-y-3">
    <div className="flex items-center space-x-2 text-emerald-400/60 uppercase text-[10px] font-bold tracking-widest">
      {icon}
      <span>{label}</span>
    </div>
    <div className="flex items-baseline space-x-1">
      <span className="text-xl font-bold truncate max-w-full">{value}</span>
      <span className="text-xs text-gray-500">{unit}</span>
    </div>
  </div>
);

export default Predict;

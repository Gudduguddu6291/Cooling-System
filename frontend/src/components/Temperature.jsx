import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Cpu, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Temperature = () => {
  const [time, setTime] = useState(new Date());
  const [apiData, setApiData] = useState({
    outsideTemp: null,
    humidity: null,
    loading: true,
    error: false // Track if API fails
  });

  useEffect(() => {
    const fetchOutsideWeather = async () => {
      try {
        const key = import.meta.env.VITE_YOUR_API_KEY;
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/realtime?location=22.5559,88.4875&apikey=${key}`
        );
        
        const data = response.data?.data?.values;
        
        // Only stop loading if we actually have values
        if (data && data.temperature !== undefined) {
          setApiData({
            outsideTemp: data.temperature.toFixed(1),
            humidity: Math.round(data.humidity),
            loading: false,
            error: false
          });
        } else {
          throw new Error("Invalid Data");
        }
      } catch (error) {
        console.error("API Error:", error.message);
        // Keep loading: true so skeletons stay visible, but mark error: true
        setApiData(prev => ({ ...prev, error: true }));
      }
    };

    fetchOutsideWeather();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
  { 
    label: 'Current Temp', 
    value: '6.2°C', 
    status: 'Stable', 
    icon: <Thermometer size={35} />, 
    isLoading: false,
    // Theme Color: Blue
    glowColor: 'rgba(59,130,246,0.5)', 
    glowClass: 'group-hover:text-blue-500 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    dotColor: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
  },
  { 
    label: 'Humidity', 
    value: `${apiData.humidity}%`, 
    status: 'Normal', 
    icon: <Droplets size={35} />, 
    isLoading: apiData.loading || apiData.humidity === null,
    // Theme Color: Emerald
    glowColor: 'rgba(16,185,129,0.5)',
    glowClass: 'group-hover:text-emerald-500 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    dotColor: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
  },
  { 
    label: 'Outside Temp', 
    value: `${apiData.outsideTemp}°C`, 
    status: apiData.outsideTemp > 30 ? 'High' : 'Normal', 
    icon: <Sun size={35} />, 
    isLoading: apiData.loading || apiData.outsideTemp === null,
    // Theme Color: Orange
    glowColor: 'rgba(249,115,22,0.5)',
    glowClass: 'group-hover:text-orange-500 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]',
    dotColor: apiData.outsideTemp > 30 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
  },
  { 
    label: 'Predicted Temp', 
    value: '5.8°C', 
    status: '92% Acc.', 
    icon: <Cpu size={35} />, 
    isLoading: false,
    // Theme Color: Purple
    glowColor: 'rgba(168,85,247,0.5)',
    glowClass: 'group-hover:text-purple-500 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    dotColor: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]'
  },
];

  const SkeletonCard = ({ isError }) => (
    <div className="bg-white rounded-[22px] p-5 border border-slate-100 min-h-[125px] flex flex-col justify-between overflow-hidden relative">
      <div className="flex justify-between items-start">
        <div className="w-20 h-3 bg-slate-200 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
      </div>
      <div className="space-y-3">
        {/* If there's an error, show a tiny hint, otherwise keep it purely skeleton */}
        <div className="w-16 h-8 bg-slate-200 rounded-lg animate-pulse" />
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse" />
           <div className="w-20 h-2 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </div>
      {/* Moving Shimmer Effect */}
      <motion.div 
        initial={{ x: '-100%' }} animate={{ x: '100%' }} 
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
      {isError && (
        <div className="absolute bottom-2 right-2 opacity-20">
          <AlertCircle size={14} className="text-red-500" />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
      {stats.map((item, index) => (
        <AnimatePresence key={index} mode="wait">
          {item.isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonCard isError={apiData.error} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group bg-white rounded-[22px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between min-h-[125px] cursor-pointer relative z-0 hover:z-10 transition-all duration-300"
            >
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{item.label}</span>
                <div className={`p-2 bg-slate-50 rounded-xl transition-all duration-300 ${item.glowClass}`}>
                  {item.icon}
                </div>
              </div>
              <div className="mt-2 relative z-10">
                <h3 className={`text-2xl font-bold tracking-tight  transition-all duration-300 `} style={{ color: item.glowColor.replace('0.5', '1'), // Make text solid color
                textShadow: `0 0 10px ${item.glowColor}` // Add subtle text glow
}}>
                  {item.value}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`w-2 h-2 rounded-full animate-pulse transition-all duration-500 ${item.dotColor}`}></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.status}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* TIME BLOCK */}
      <div className="bg-[#0D2546] text-white rounded-[22px] p-5 shadow-[0_20px_40px_rgba(13,37,70,0.3)] flex flex-col justify-between border border-white/10 min-h-[125px] cursor-pointer">
         {/* ... (Clock content remains the same) ... */}
         <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
            </span>
            <span className="text-[9px] font-black text-green-400 tracking-[0.2em]">LIVE MONITOR</span>
          </div>
        </div>
        <div className="mt-1">
          <span className="text-3xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200">
            {time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <p className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">
            {time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Temperature;
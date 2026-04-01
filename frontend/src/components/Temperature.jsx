import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Sun, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import axios from 'axios';
import { serverUrl } from '../App';
import { useTemperature } from '../context/TemperatureContext.jsx';

const Temperature = () => {
  const { 
    globalTemp, 
    currentHighTemp, 
    previousHighTemp, 
    isGlobalTempHigh, 
    setPredicted ,
    predicted// Hook to send data to global context
  } = useTemperature();

  const { apiData } = useWeather();
  const [time, setTime] = useState(new Date());
  const tempHistory = useRef([]);

  const displayedPreviousHighTemp = previousHighTemp ?? currentHighTemp;
  const sharedTransition = { type: 'spring', stiffness: 500, damping: 15 };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sendToML = async (currentTemp) => {
    try {
      const temp = Number(currentTemp);
      tempHistory.current.push(temp);

      if (tempHistory.current.length > 3) tempHistory.current.shift();
      if (tempHistory.current.length < 3) return null;

      const lag1 = tempHistory.current[2];
      const lag2 = tempHistory.current[1];
      const lag3 = tempHistory.current[0];
      const rolling_mean = (lag1 + lag2 + lag3) / 3;
      const month = new Date().getMonth() + 1;

      const res = await axios.post(`${serverUrl}/api/sendtoml`, {
        lag1, lag2, lag3, rolling_mean, month
      }, { withCredentials: true });

      return res.data;
    } catch (error) {
      console.error("Error sending to ML:", error);
      return null;
    }
  };

  // 🤖 Logic remains active but UI card is removed
  useEffect(() => {
    const fetchPrediction = async () => {
      const result = await sendToML(Number(globalTemp.toFixed(2)));
      if (result?.predictedTemp !== undefined) {
        // Sending result to global context hook
        setPredicted(Number(result.predictedTemp.toFixed(2)));
      }
    };

    fetchPrediction();
    const interval = setInterval(fetchPrediction, 10000);
    return () => clearInterval(interval);
  }, [globalTemp, setPredicted]);

  const stats = [
    { 
      label: 'Current Temp', 
      value: `${Number(globalTemp).toFixed(1)}°C`, 
      status: isGlobalTempHigh ? 'High' : 'Stable', 
      icon: <Thermometer size={22} />, 
      isLoading: false,
      glowColor: isGlobalTempHigh ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)', 
      glowClass: isGlobalTempHigh ? 'group-hover:text-red-500' : 'group-hover:text-blue-500',
      dotColor: isGlobalTempHigh ? 'bg-red-500' : 'bg-emerald-500'
    },
    { 
      label: 'Humidity', 
      value: apiData.humidity ? `${apiData.humidity}%` : '--%', 
      status: 'Normal', 
      icon: <Droplets size={22} />, 
      isLoading: apiData.loading,
      glowColor: 'rgba(16,185,129,0.4)',
      glowClass: 'group-hover:text-emerald-500',
      dotColor: 'bg-emerald-500'
    },
    { 
      label: 'Outside', 
      value: apiData.outsideTemp ? `${apiData.outsideTemp}°C` : '--°C', 
      status: apiData.outsideTemp > 30 ? 'High' : 'Normal', 
      icon: <Sun size={22} />, 
      isLoading: apiData.loading,
      glowColor: 'rgba(249,115,22,0.4)',
      glowClass: 'group-hover:text-orange-500',
      dotColor: apiData.outsideTemp > 30 ? 'bg-red-500' : 'bg-emerald-500'
    },
    { 
      label: 'Prev High', 
      value: displayedPreviousHighTemp !== null ? `${Number(displayedPreviousHighTemp).toFixed(1)}°C` : '--°C', 
      status: 'High Record', 
      icon: <AlertCircle size={22} />, 
      isLoading: false,
      glowColor: 'rgba(239,68,68,0.4)', 
      glowClass: 'group-hover:text-red-500',
      dotColor: displayedPreviousHighTemp !== null ? 'bg-red-500' : 'bg-slate-400'
    }
  ];

  return (
    // Reverted back to 5 columns (4 stats + 1 clock)
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 select-none">
      {stats.map((item, index) => (
        <AnimatePresence key={index} mode="wait">
          {item.isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-[24px] p-5 border border-slate-100 h-[135px] animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.03, 
                y: -4,
                boxShadow: `0 20px 40px -15px ${item.glowColor}, 0 0 15px -5px ${item.glowColor}`,
                '--label-glow': `0 0 12px ${item.glowColor}`,
                '--icon-glow': `drop-shadow(0 0 10px ${item.glowColor})`
              }}
              transition={sharedTransition}
              className="group bg-white rounded-[24px] p-5 border border-slate-100/80 flex flex-col justify-between h-[135px] cursor-pointer relative"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] transition-all duration-300 group-hover:text-slate-900" style={{ textShadow: 'var(--label-glow, none)' }}>
                  {item.label}
                </span>
                <div className={`p-2 bg-slate-50/50 rounded-xl transition-all duration-300 ${item.glowClass}`} style={{ filter: 'var(--icon-glow, none)' }}>
                  {item.icon}
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-extrabold tracking-tighter transition-all duration-300" style={{ color: item.glowColor.replace('0.4', '1'), textShadow: 'var(--label-glow, none)' }}>
                  {item.value}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.dotColor}`}></span>
                  <span className="text-[10px] font-bold text-slate-500/80 uppercase tracking-tight">{item.status}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* 🕒 TIME BLOCK */}
      <motion.div 
        whileHover={{ scale: 1.03, y: -4 }}
        transition={sharedTransition}
        className="bg-[#0A1D37] text-white rounded-[24px] p-5 shadow-xl flex flex-col justify-between border border-white/5 h-[135px] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-black text-emerald-400 tracking-[0.2em]">LIVE MONITOR</span>
        </div>
        <div className="mb-0.5">
          <span className="text-2xl font-mono font-bold tracking-tighter text-white/95">
            {time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <p className="text-[9px] font-bold text-blue-300/70 uppercase tracking-widest mt-1">
            {time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Temperature;
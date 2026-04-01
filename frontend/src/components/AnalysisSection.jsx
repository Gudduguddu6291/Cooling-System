import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingDown, ShieldCheck, Loader2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useTemperature } from '../context/TemperatureContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

const AnalysisSection = () => {
  const { apiData } = useWeather();
  const { globalTemp, predicted } = useTemperature();
  const navigate = useNavigate();
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch 24H History from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/sensors/history`, {
          withCredentials: true,
        });
        
        // Format data for Recharts
        const formatted = response.data.map(log => ({
          // Format timestamp to HH:mm for the X-Axis
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          temp: Number(log.temp).toFixed(1),
          fullDate: new Date(log.timestamp).toLocaleString() // For tooltip
        }));

        // Recharts needs chronological order (Oldest -> Newest)
        // If your API sends newest first, use .reverse()
        setChartData(formatted.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
        setLoading(false);
      }
    };

    fetchHistory();
    // Refresh every 5 minutes to keep trends current
    const interval = setInterval(fetchHistory, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 select-none">
      
      {/* 📊 TEMPERATURE TREND GRAPH */}
      <div className="lg:col-span-2 bg-white rounded-[22px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[250px]">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-tight">Thermal Stability</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {loading ? 'Synchronizing...' : '24H Real-Time Trend'}
            </p>
          </div>
          {!loading && (
            <span className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg ${
              globalTemp > 5 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
            }`}>
              <ShieldCheck size={10} /> {globalTemp > 5 ? 'BREACH' : 'OPTIMAL'}
            </span>
          )}
        </div>

        <div className="h-[180px] w-full flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Loading Matrix</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 9, fill: '#94a3b8'}}
                  interval="preserveStartEnd"
                />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Tooltip 
                  labelKey="fullDate"
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                    fontSize: '11px',
                    fontWeight: 'bold' 
                  }}
                  formatter={(value) => [`${value}°C`, 'Temperature']}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 🧠 AI PREDICTION SECTION */}
      <div className="bg-[#0D2546] rounded-[22px] p-5 shadow-xl text-white flex flex-col justify-between border border-white/5 relative overflow-hidden h-full">
        <div className="absolute -top-2 -right-2 p-4 opacity-5">
          <BrainCircuit size={100} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit size={16} className="text-purple-400" />
            <span className="text-[9px] font-black text-purple-400 tracking-[0.2em] uppercase">AI Analytics</span>
          </div>
          <h3 className="text-lg font-bold leading-tight">Thermal Shift</h3>
          <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">ML projection based on <span className="text-white">{apiData.humidity || 0}%</span> humidity levels.</p>
        </div>

        <div className="relative z-10 mt-4 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[8px] font-black text-blue-300 uppercase tracking-widest">Expected 4H</p>
              <h4 className="text-2xl font-mono font-bold">{predicted || '--'}°C</h4>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${
                predicted < globalTemp ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {predicted < globalTemp ? <TrendingDown size={12} /> : null} 
                {(predicted - globalTemp).toFixed(1)}°C
              </div>
              <p className="text-[8px] text-slate-500 uppercase font-bold">Trend Shift</p>
            </div>
          </div>
        </div>

        <button 
          className="relative z-10 mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-[10px] transition-all tracking-[0.15em] uppercase outline-none" 
          onClick={() => navigate('/history')}
        >
          View Full Archive
        </button>
      </div>
    </div>
  );
};

export default AnalysisSection;

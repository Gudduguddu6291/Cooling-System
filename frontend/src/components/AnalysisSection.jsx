import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingDown, ShieldCheck } from 'lucide-react';
import { useWeather } from '../context/WeatherContext'; // Using your global state

const AnalysisSection = () => {
  const { apiData } = useWeather();

  // Mock Trend data - in a real app, you'd calculate this from API history
  const chartData = [
    { time: '00:00', temp: 5.8 }, 
    { time: '08:00', temp: 6.4 }, 
    { time: '16:00', temp: 5.9 }, 
    { time: 'Current', temp:6.2 },
  ];

  return (
    // reduced mt-8 to mt-4 to save vertical space
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 select-none">
      
      {/* 📊 TEMPERATURE TREND GRAPH */}
      <div className="lg:col-span-2 bg-white rounded-[22px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-tight">Thermal Stability</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">24H Monitoring</p>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <ShieldCheck size={10} /> OPTIMAL
          </span>
        </div>

        {/* Height reduced from 250px to 180px */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} style={{ outline: 'none' }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
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
          <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">ML projection based on <span className="text-white">{apiData.humidity}%</span> humidity levels.</p>
        </div>

        <div className="relative z-10 mt-4 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[8px] font-black text-blue-300 uppercase tracking-widest">Expected 4H</p>
              <h4 className="text-2xl font-mono font-bold">5.4°C</h4>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-emerald-400 text-[10px] font-bold">
                <TrendingDown size={12} /> -0.8°C
              </div>
              <p className="text-[8px] text-slate-500 uppercase font-bold">Efficiency</p>
            </div>
          </div>
        </div>

        <button className="relative z-10 mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-[10px] transition-all tracking-[0.15em] uppercase outline-none focus:outline-none">
          Get Report
        </button>
      </div>

    </div>
  );
};

export default AnalysisSection;
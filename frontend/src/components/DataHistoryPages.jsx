import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Brush } from 'recharts';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';

const DataHistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/sensors/history`,{withCredentials: true});
        setHistoryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Archive Matrix...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* --- TOP BAR: FILTERS & EXPORT --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Data History</h1>
          <p className="text-sm text-slate-500">Archive Matrix • Last 7 Days</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input type="text" placeholder="Search Sensor ID..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64" />
          </div>
          <button className="flex items-center gap-2 bg-[#0B1A3D] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-800 transition-all">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* --- MAIN GRAPH SECTION --- */}
      <div className="bg-[#0B1A3D] rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest">Temperature & Efficiency Trends</h3>
          <div className="flex gap-4 text-[10px] uppercase font-bold">
            <span className="flex items-center text-blue-400"><div className="w-2 h-2 bg-blue-400 rounded-full mr-2"/> Temperature</span>
            <span className="flex items-center text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"/> Efficiency</span>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#64748b" 
                fontSize={10} 
                tickFormatter={(str) => new Date(str).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={2000} />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              {/* THE BRUSH: Allows user to zoom/scroll through history */}
              <Brush dataKey="timestamp" height={30} stroke="#334155" fill="#0f172a" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- DATA LOG TABLE --- */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Sensor ID</th>
              <th className="px-6 py-4">Reading</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {historyData.slice(0, 10).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-600">
                   {new Date(row.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono">SC-9901</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800">{row.temp}°C</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${row.temp > 7 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {row.temp > 7 ? 'Breach' : 'Stable'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-blue-600 font-bold cursor-pointer hover:underline">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataHistoryPage;
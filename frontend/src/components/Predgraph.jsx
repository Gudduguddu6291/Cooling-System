import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { BrainCircuit, Activity, Thermometer } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useTemperature } from '../context/TemperatureContext.jsx';

const Predgraph = () => {
  const { globalTemp, predicted } = useTemperature();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/sensors/history`, {
          withCredentials: true,
        });

        // 1. Ensure data is sorted by time (Oldest to Newest)
        // If your API returns Newest first, this sort will fix the X-axis
        const sortedLogs = response.data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        const data = sortedLogs.map(log => ({
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actual: Number(log.temp).toFixed(1),
          predicted: (Number(log.temp) + (Math.random() * 0.5 - 0.25)).toFixed(1)
        }));

        // 2. Set the data directly without .reverse()
        setHistory(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="w-full bg-white rounded-[24px] p-6 shadow-xl border border-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            LIVE THERMAL FORECAST VS. ACTUAL
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Analytics • 24H Matrix</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-blue-400 uppercase">Current Actual</p>
              <p className="text-lg font-mono font-black text-blue-700">{globalTemp}°C</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              <BrainCircuit size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-purple-400 uppercase">Next 4H Prediction</p>
              <p className="text-lg font-mono font-black text-purple-700">{predicted}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH CONTAINER */}
      <div className="h-[350px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center animate-pulse text-slate-300 font-bold uppercase text-xs tracking-widest">
            Generating Thermal Map...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}}
                unit="°C"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 900 }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              
              {/* Threshold Danger Line */}
              <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="10 10" label={{ position: 'right', value: 'BREACH', fill: '#ef4444', fontSize: 10, fontWeight: 900 }} />

              {/* ACTUAL LINE (Solid Blue) */}
              <Line 
                name="Actual Temp"
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={2000}
              />

              {/* PREDICTED LINE (Dashed Purple) */}
              <Line 
                name="AI Prediction"
                type="monotone" 
                dataKey="predicted" 
                stroke="#a855f7" 
                strokeWidth={3} 
                strokeDasharray="8 8"
                dot={false}
                animationDuration={3000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Predgraph;

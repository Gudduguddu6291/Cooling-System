import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTemperature } from '../context/TemperatureContext.jsx';
import axios from 'axios';
import { serverUrl } from '../App';

const AlertSection = () => {
  const { globalTemp } = useTemperature();
  const [dbAlerts, setDbAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch History from Database
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/sensors/history`, {
          withCredentials: true,
        });
        // Filter only temperatures > 5 from the database
        const breaches = response.data.filter(log => log.temp > 5);
        setDbAlerts(breaches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alert history:", error);
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // 2. Logic: Merge Real-time Global Temp with Database History
  const alertsData = [];

  // Add LIVE alert if current globalTemp is high
  if (globalTemp > 5) {
    alertsData.push({
      id: 'live-alert',
      timestamp: new Date().toLocaleTimeString(),
      type: "High Temp.",
      details: "Cold Storage Room 1",
      currentTemp: globalTemp,
      status: "LIVE", // Marked as LIVE
      isLive: true
    });
  }

  // Add RECORDED alerts from Database
  dbAlerts.forEach((log, index) => {
    alertsData.push({
      id: log._id || index,
      timestamp: new Date(log.timestamp).toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
      }),
      type: "High Temp.",
      details: "Zone Archive Log",
      currentTemp: log.temp,
      status: "RECORDED", // Marked as RECORDED
      isLive: false
    });
  });

  if (loading) return (
    <div className="flex items-center justify-center p-20 text-slate-400 gap-2">
      <Loader2 className="animate-spin" /> Scanning Archive Matrix...
    </div>
  );

  return (
    <div className="w-full p-6 bg-[#f8fafc] min-h-full font-sans">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b] tracking-tight uppercase">
            Alerts & Threshold Breaches
          </h2>
          <p className="text-xs font-bold text-slate-400">Monitoring System • Threshold: 5.0°C</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Source</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Reading</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {alertsData.length > 0 ? (
              alertsData.map((alert) => (
                <tr 
                  key={alert.id} 
                  className={`border-b transition-colors ${
                    alert.isLive ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <td className="p-4 text-sm font-medium text-slate-600">{alert.timestamp}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{alert.details}</td>
                  <td className="p-4 text-sm">
                    <span className={`font-black ${alert.isLive ? 'text-red-600' : 'text-slate-500'}`}>
                      {Number(alert.currentTemp).toFixed(1)}°C
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-black tracking-widest ${
                      alert.isLive 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {alert.isLive ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                  No threshold breaches detected in system history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertSection;

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTemperature } from '../context/TemperatureContext.jsx';

const AlertSection = () => {
  const { globalTemp } = useTemperature();

  // 1. Define base data
  const baseAlerts = [
    {
      id: 2,
      timestamp: "31 Mar, 20:45",
      type: "High Temp.",
      details: "Zone 4, Current Temp. > 8°C",
      currentTemp: 7.2,
      status: "RESOLVED"
    }
  ];

  // 2. Logic: If globalTemp > 8, prepend a new Critical Alert to the list
  const alertsData = globalTemp > 8 
    ? [
        {
          id: Date.now(), // Unique ID for the new alert
          timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: "High Temp.",
          details: `Cold Storage Room 1, Current Temp. > 8°C`,
          currentTemp: globalTemp,
          status: "ACTIVE"
        },
        ...baseAlerts
      ]
    : baseAlerts;

  return (
    <div className="w-full p-6 bg-[#f8fafc] min-h-full font-sans">
      <h2 className="text-2xl font-black text-[#1e293b] mb-6 tracking-tight">
        ALERTS SECTION
      </h2>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Alert Type</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Details</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {alertsData.map((alert) => {
              // Row is critical if its own temp > 8 OR it's marked ACTIVE
              const isCritical = alert.currentTemp > 8 || alert.status === "ACTIVE";
              
              return (
                <tr 
                  key={alert.id} 
                  className={`border-b transition-colors ${
                    isCritical ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <td className="p-4 text-sm font-medium text-slate-600">{alert.timestamp}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{alert.type}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      {alert.details}
                      <span className={`font-bold ${isCritical ? 'text-red-600' : 'text-slate-400'}`}>
                        ({alert.currentTemp}°C)
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-black tracking-tighter ${
                      isCritical 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isCritical ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      {alert.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 items-center">
        <button className="bg-[#1e293b] text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 shadow-md transition-all active:scale-95">
          Acknowledge All
        </button>
        <button className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
          View History
        </button>
        <button className="ml-auto bg-slate-100 text-slate-500 px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlertSection;
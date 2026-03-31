import React, { useState } from 'react';
import { Bluetooth, Search, Database, CheckCircle, Plus, X, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate
import { useTemperature } from '../context/TemperatureContext'; // 2. Ensure path is correct

const AddSensorPage = () => {
  const navigate = useNavigate(); // Initialize navigation
  
  // State for switching between Auto and Manual modes
  const [activeMode, setActiveMode] = useState('auto');
  
  // 3. Use ONLY the global state (Remove the local const [temp])
  const { globalTemp, setGlobalTemp } = useTemperature();

  // Helper to change temperature text color based on safety
  const getTempColorClass = () => {
    if (globalTemp <= -10) return 'text-blue-500'; // Optimal Cold
    if (globalTemp <= 4) return 'text-emerald-500'; // Chilled
    return 'text-orange-500'; // Warning/Warm
  };

  // 4. Handle the "Initialize" click
  const handleInitialize = (e) => {
    e.preventDefault();
    // The temperature is already saved in globalTemp via the slider
    // Now we just push the user to the display page
    navigate('/'); 
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[650px] animate-in fade-in duration-500">
      
      {/* --- PAGE HEADER --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Add New Sensor</h2>
        <p className="text-gray-500">Register a new smart device to the storage network.</p>
      </div>

      {/* --- MODE SWITCHER --- */}
      <div className="flex justify-center mb-10 ">
        <div className="bg-gray-100 p-1 rounded-full flex w-80 shadow-inner ">
          <button
            onClick={() => setActiveMode('auto')}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-full transition-all duration-300 font-medium text-sm cursor-pointer ${
              activeMode === 'auto' 
              ? 'bg-[#0B1A3D] text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bluetooth className="w-4 h-4 mr-2" />
            Auto-Connect
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-full transition-all duration-300 font-medium text-sm cursor-pointer ${
              activeMode === 'manual' 
              ? 'bg-[#0B1A3D] text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Database className="w-4 h-4 mr-2" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: IOT DISCOVERY */}
        <div className={`border rounded-2xl p-6 transition-all duration-500 bg-white ${activeMode !== 'auto' ? 'opacity-30 grayscale pointer-events-none scale-[0.98]' : 'opacity-100 shadow-md border-blue-100'}`}>
          <h3 className="text-lg font-semibold mb-6 flex items-center text-slate-700">
            <Search className="w-5 h-5 mr-2 text-blue-600" />
            IoT Discovery
          </h3>
          
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-slate-50/50 mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
              <div className="bg-white p-4 rounded-full shadow-sm relative z-10">
                <Bluetooth className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium animate-pulse text-center">
              Scanning for hardware...
            </p>
          </div>

          <div className="space-y-3">
            {[ {id: 'SCS-9901', type: 'Temp'}, {id: 'SCS-9902', type: 'Humid'} ].map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-sm text-slate-800">{device.id}</p>
                  <p className="text-xs text-blue-500 font-medium uppercase">{device.type} Sensor</p>
                </div>
                <button className="bg-[#0B1A3D] text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer">
                  Pair
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: MANUAL CONFIGURATION */}
        <div className={`border rounded-2xl p-6 transition-all duration-500 bg-white ${activeMode !== 'manual' ? 'opacity-30 grayscale pointer-events-none scale-[0.98]' : 'opacity-100 shadow-md border-blue-100'}`}>
          <h3 className="text-lg font-semibold mb-6 flex items-center text-slate-700 ">
            <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
            Manual Setup
          </h3>
          
          {/* 5. Link form to the handleInitialize function */}
          <form className="space-y-5" onSubmit={handleInitialize}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Nickname</label>
                <input type="text" placeholder="Cold Zone 1" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Zone</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none cursor-pointer">
                  <option>Main Freezer</option>
                  <option>Warehouse A</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC TEMPERATURE SLIDER */}
            <div className="bg-[#0B1A3D]/5 p-5 rounded-2xl border border-blue-50">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Temp</label>
                <span className={`font-mono font-black text-xl px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100 ${getTempColorClass()}`}>
                  {globalTemp}°C
                </span>
              </div>
              
              <input 
                type="range" 
                min="-40" 
                max="25" 
                value={globalTemp}
                onChange={(e) => setGlobalTemp(e.target.value)} // Updates Global Context
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B1A3D]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1 text-slate-400">Sensor ID / Serial No.</label>
              <input type="text" placeholder="SC-92-XP-01" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none" required />
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-bold uppercase tracking-tight">
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="flex-[2] py-3.5 bg-[#0B1A3D] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                Initialize at {globalTemp}°C
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddSensorPage;
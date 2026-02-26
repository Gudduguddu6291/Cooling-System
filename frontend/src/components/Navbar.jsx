import React from 'react';
import { LayoutDashboard, Database, LineChart, History, Settings2, Bell, FileText, Settings, X } from 'lucide-react';
import { FaSnowflake } from 'react-icons/fa';

const Navbar = ({ isOpen, setIsOpen }) => {
  return (
    <aside className={`
      /* MOBILE STYLES: Fixed, high z-index, slides in/out */
      fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D37] transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      
      /* DESKTOP STYLES: Static (takes up space), always visible (translate-x-0) */
      lg:static lg:translate-x-0 
      
      flex flex-col no-scrollbar
    `}>
      
      {/* HEADER WITH CLOSE BUTTON (Mobile Only) */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <FaSnowflake className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, }}
            >Smart Cold Storage</h1>
            <p className="text-blue-400 text-[9px] font-bold tracking-widest uppercase">AI Control</p>
          </div>
        </div>
        
        {/* Close icon visible ONLY on mobile */}
        <button className="lg:hidden text-gray-400" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active  className="hover:cursor-pointer"/>
        <NavItem icon={<Database size={20}/>} label="Add Sensor Data" />
        <NavItem icon={<LineChart size={20}/>} label="Prediction" />
        <NavItem icon={<History size={20}/>} label="Data History" />
        <NavItem icon={<Settings2 size={20}/>} label="Control Panel" />
        <NavItem icon={<Bell size={20}/>} label="Alerts" />
        <NavItem icon={<FileText size={20}/>} label="Reports" />
        {/* <NavItem icon={<Settings size={20}/>} label="Settings" /> */}
      </nav>

      {/* SYSTEM STATUS CARD (Visible on all devices) */}
      <div className="p-6">
        <div className="bg-[#122B4A] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-blue-300 font-bold uppercase">System Status</span>
          </div>
          <p className="text-xs text-white font-medium mb-3">All Systems Normal</p>
          <div className="h-12 bg-[#0D2546] rounded-lg border border-white/5 opacity-40"></div>
        </div>
        <p className="mt-4 text-[10px] text-gray-500 text-center">© 2026 Cold Storage AI</p>
      </div>
    </aside>
  );
};

// Helper component for cleaner code
const NavItem = ({ icon, label, active = false }) => (
  <button
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active
        ? "bg-blue-600/20 text-white shadow-md shadow-blue-500/20"
        : "text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer"
    }`}
  >
    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-transparent bg-clip-text text-transparent">
      {icon}
    </span>

    <span className="text-sm font-medium">{label}</span>
  </button>);

export default Navbar;


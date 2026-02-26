import React,{ useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { AnimatePresence, motion } from 'framer-motion';
import Temperature from '../components/temperature';
import AnalysisSection from '../components/AnalysisSection';
import axios from 'axios';
import { WeatherProvider } from '../context/WeatherContext';


function Home() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  

  return (
    <div className="w-full min-h-screen flex bg-[#F0F4F8] overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* Sidebar Animation */}
        <motion.div
          key="Navbar"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden"
        >
          
          {/* Header Animation */}
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header setIsOpen={setIsMobileOpen} />
          </motion.div>

          {/* Dashboard Scroll Area Animation */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10"
          >
            {/* Your cards and charts go here */}
            <WeatherProvider>
              <Temperature/>
              <AnalysisSection/>
            </WeatherProvider>
          </motion.main>
        </motion.div>

        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        {/* / */}
      </AnimatePresence>
  
    </div>
  );
}

export default Home;
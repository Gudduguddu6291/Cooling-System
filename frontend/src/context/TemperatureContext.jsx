import React, { createContext, useContext, useState, useEffect } from 'react';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  // --- 1. INITIALIZE STATE (from LocalStorage or Defaults) ---
  
  // Current Live Temperature
  const [globalTemp, setGlobalTemp] = useState(() => {
    const saved = localStorage.getItem('globalTemp');
    return saved !== null ? Number(saved) : -4.0;
  });

  // The absolute highest recorded temperature
  const [currentHighTemp, setCurrentHighTemp] = useState(() => {
    const saved = localStorage.getItem('currentHighTemp');
    return saved !== null ? Number(saved) : -4.0;
  });

  // The previous high record (specifically for values > 5°C)
  const [previousHighTemp, setPreviousHighTemp] = useState(() => {
    const saved = localStorage.getItem('previousHighTemp');
    return saved !== null ? Number(saved) : null;
  });

  // ML Prediction and Alert Status
  const [predicted, setPredicted] = useState(null);
  const [isGlobalTempHigh, setIsGlobalTempHigh] = useState(false);

  // --- 2. PERSISTENCE & MONITORING ENGINE ---
  
 // --- 2. PERSISTENCE & MONITORING ENGINE ---
  useEffect(() => {
    // A. Sync current temperature to storage
    localStorage.setItem('globalTemp', globalTemp.toString());

    // B. Alert Logic: High if above 8 degrees
    setIsGlobalTempHigh(globalTemp > 8);

    // C. High Record Logic (Filtered: Both Current & Previous must be > 5)
    if (globalTemp > 5) {
     
        
        // ONLY move to Previous High if the old value was also > 5
        // This prevents "Stable" temps (like -4 or 2) from cluttering the High Record
        if (currentHighTemp > 5) {
          setPreviousHighTemp(currentHighTemp);
          localStorage.setItem('previousHighTemp', currentHighTemp.toString());
        }

        // Update the absolute Current High
        setCurrentHighTemp(globalTemp);
        localStorage.setItem('currentHighTemp', globalTemp.toString());
      }
    }
  , [globalTemp, currentHighTemp]);
  // --- 3. EXPOSE CONTEXT ---
  
  return (
    <TemperatureContext.Provider
      value={{
        globalTemp,
        setGlobalTemp,
        currentHighTemp,
        previousHighTemp,
        isGlobalTempHigh,
        predicted,
        setPredicted,
      }}
    >
      {children}
    </TemperatureContext.Provider>
  );
};

// --- 4. CUSTOM HOOK FOR EASY ACCESS ---

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};
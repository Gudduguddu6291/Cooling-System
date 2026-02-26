import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

// 1. Create the Context
export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [apiData, setApiData] = useState({
    outsideTemp: null,
    humidity: null,
    loading: true,
    error: false,
    lastUpdated: null
  });

  // 2. The Fetch Logic (Wrapped in useCallback for manual refresh support)
  const fetchWeather = useCallback(async () => {
    // Only set loading on the first fetch to avoid UI flickering during background syncs
    if (!apiData.outsideTemp) {
        setApiData(prev => ({ ...prev, loading: true }));
    }

    try {
      const key = import.meta.env.VITE_YOUR_API_KEY;
      const response = await axios.get(
        `https://api.tomorrow.io/v4/weather/realtime?location=22.5559,88.4875&apikey=${key}`
      );
      
      const data = response.data?.data?.values;
      
      if (data && data.temperature !== undefined) {
        setApiData({
          outsideTemp: data.temperature.toFixed(1),
          humidity: Math.round(data.humidity),
          loading: false,
          error: false,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } else {
        throw new Error("Invalid API Structure");
      }
    } catch (error) {
      console.error("Telemetry Sync Failed:", error.message);
      setApiData(prev => ({ 
        ...prev, 
        error: true, 
        loading: false 
      }));
    }
  }, [apiData.outsideTemp]);

  // 3. Lifecycle Management (Auto-Sync)
  useEffect(() => {
    fetchWeather();

    // Sync every 10 minutes to stay within Tomorrow.io free tier limits
    const interval = setInterval(fetchWeather, 600000); 
    
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // 4. Provider Value
  return (
    <WeatherContext.Provider value={{ apiData, refetch: fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

// 5. Custom Hook for clean consumption in components
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
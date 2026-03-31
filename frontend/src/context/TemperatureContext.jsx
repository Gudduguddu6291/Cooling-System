import React, { createContext, useState, useContext } from 'react';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [globalTemp, setGlobalTemp] = useState(-18);

  return (
    <TemperatureContext.Provider value={{ globalTemp, setGlobalTemp }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => useContext(TemperatureContext);